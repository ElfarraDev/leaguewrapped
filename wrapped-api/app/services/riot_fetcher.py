import asyncio
import json
import os
import sqlite3
import time
from aiohttp import ClientSession
from aiolimiter import AsyncLimiter

RIOT_API_KEY = os.getenv("RIOT_API_KEY")
if not RIOT_API_KEY:
    raise RuntimeError("Missing RIOT_API_KEY in environment")

# Riot API limits
RATE_LIMIT = AsyncLimiter(20, 1)     # 20 req / 1s
LONG_LIMIT = AsyncLimiter(100, 120)  # 100 req / 2min

DB_PATH = "cache.db"
CACHE_TTL = int(os.getenv("CACHE_TTL", 6 * 3600))  # default: 6 hours

# --------------------------------------------------------------------
# SQLite cache helper (with TTL)
# --------------------------------------------------------------------
class CacheDB:
    def __init__(self, path=DB_PATH):
        self.conn = sqlite3.connect(path, check_same_thread=False)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS cache (
                key TEXT PRIMARY KEY,
                data TEXT,
                ts REAL
            )
        """)
        self.conn.commit()

    def get(self, key: str):
        """Return cached item if still fresh, else None."""
        cur = self.conn.cursor()
        cur.execute("SELECT data, ts FROM cache WHERE key=?", (key,))
        row = cur.fetchone()
        if not row:
            return None

        data, ts = row
        if time.time() - ts > CACHE_TTL:
            print(f"[CACHE] ⏳ Expired: {key}")
            self.delete(key)
            return None

        return json.loads(data)

    def set(self, key: str, data: dict):
        """Store item with current timestamp."""
        self.conn.execute(
            "REPLACE INTO cache (key, data, ts) VALUES (?, ?, ?)",
            (key, json.dumps(data), time.time())
        )
        self.conn.commit()

    def delete(self, key: str):
        """Delete one cache entry."""
        self.conn.execute("DELETE FROM cache WHERE key=?", (key,))
        self.conn.commit()

    def cleanup_expired(self):
        """Delete all expired rows."""
        threshold = time.time() - CACHE_TTL
        self.conn.execute("DELETE FROM cache WHERE ts < ?", (threshold,))
        self.conn.commit()
        print("[CACHE] 🧹 Cleaned up expired entries")

cache = CacheDB()

# --------------------------------------------------------------------
# Riot fetcher functions
# --------------------------------------------------------------------
async def _fetch_json(session: ClientSession, url: str):
    """Fetch JSON with built-in rate limiting and retries."""
    async with RATE_LIMIT, LONG_LIMIT:
        for attempt in range(3):
            try:
                headers = {"X-Riot-Token": RIOT_API_KEY}
                async with session.get(url, headers=headers, timeout=20) as resp:
                    if resp.status == 429:
                        await asyncio.sleep(2)
                        continue
                    resp.raise_for_status()
                    return await resp.json()
            except Exception as e:
                if attempt == 2:
                    print(f"[RIOT_FETCHER] ❌ Failed: {url} ({e})")
                    raise
                await asyncio.sleep(1)

async def fetch_match(session: ClientSession, cluster: str, match_id: str):
    """Fetch match data (with caching)."""
    key = f"match:{match_id}"
    cached = cache.get(key)
    if cached:
        print(f"[CACHE] ✅ Match hit {match_id}")
        return cached

    url = f"https://{cluster}.api.riotgames.com/lol/match/v5/matches/{match_id}"
    data = await _fetch_json(session, url)
    cache.set(key, data)
    return data

async def fetch_timeline(session: ClientSession, cluster: str, match_id: str):
    """Fetch timeline data (with caching)."""
    key = f"timeline:{match_id}"
    cached = cache.get(key)
    if cached:
        print(f"[CACHE] ✅ Timeline hit {match_id}")
        return cached
    url = f"https://{cluster}.api.riotgames.com/lol/match/v5/matches/{match_id}/timeline"
    data = await _fetch_json(session, url)
    cache.set(key, data)
    return data

async def fetch_matches_concurrent(cluster: str, match_ids: list[str], include_timeline=False):
    """Fetch many matches concurrently with rate limiting and caching."""
    async with ClientSession() as session:
        tasks = [fetch_match(session, cluster, mid) for mid in match_ids]
        matches = await asyncio.gather(*tasks, return_exceptions=True)

        if include_timeline:
            timeline_tasks = [fetch_timeline(session, cluster, mid) for mid in match_ids]
            timelines = await asyncio.gather(*timeline_tasks, return_exceptions=True)
            return list(zip(matches, timelines))

        return matches
