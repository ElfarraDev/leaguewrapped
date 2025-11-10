import os
import asyncio
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from dotenv import load_dotenv


import aiohttp

load_dotenv()

def get_api_key() -> str:
    key = os.getenv("RIOT_API_KEY")
    if not key:
        raise RuntimeError("RIOT_API_KEY is not set. Please configure it in your environment.")
    return key

RIOT_API_KEY = get_api_key()

# conservative concurrency to respect 20 rps / 100 per 120s
_SEM = asyncio.Semaphore(5)

@asynccontextmanager
async def session_ctx():
    async with aiohttp.ClientSession(raise_for_status=False) as s:
        yield s

def to_unix(dt_str: str) -> int:
    """Accepts 'YYYY-MM-DD' or RFC3339; returns UNIX seconds (UTC)."""
    if not dt_str:
        return int(time.time())
    try:
        if len(dt_str) == 10:  # YYYY-MM-DD
            dt = datetime.strptime(dt_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        else:
            dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00")).astimezone(timezone.utc)
        return int(dt.timestamp())
    except Exception:
        # default to Jan 1 2025 UTC
        return int(datetime(2025, 1, 1, tzinfo=timezone.utc).timestamp())

def region_to_cluster(region: str) -> str:
    region = region.lower()
    if region in ["na1", "br1", "la1", "la2"]:
        return "americas"
    elif region in ["euw1", "eun1", "tr1", "ru"]:
        return "europe"
    elif region in ["kr", "jp1"]:
        return "asia"
    elif region in ["oc1", "ph2", "sg2", "th2", "tw2", "vn2"]:
        return "sea"
    elif region in ["americas", "europe", "asia", "sea"]:
        return region 
    else:
        raise ValueError(f"Unknown region: {region}")

def cluster_to_region(cluster: str) -> str:
    """Return a default platform region for a given routing cluster."""
    cluster = cluster.lower()
    if cluster == "americas":
        return "na1"
    elif cluster == "europe":
        return "euw1"
    elif cluster == "asia":
        return "kr"
    elif cluster == "sea":
        return "oc1"
    else:
        return cluster


def platform_host_for_mastery(region: str) -> str:
    # Champion Mastery uses platform routing (e.g., na1.api.riotgames.com)
    r = region.lower()
    if r in {"na1","br1","la1","la2","oc1","kr","jp1","eun1","euw1","tr1","ru","ph2","sg2","th2","tw2","vn2"}:
        return f"{r}.api.riotgames.com"
    return "na1.api.riotgames.com"

async def _fetch_json(session: aiohttp.ClientSession, url: str, params: dict | None = None, retries: int = 5):
    params = params or {}
    params["api_key"] = RIOT_API_KEY
    attempt = 0
    while True:
        async with _SEM:
            async with session.get(url, params=params) as resp:
                if resp.status == 200:
                    return await resp.json()
                if resp.status == 429:
                    retry_after = int(resp.headers.get("Retry-After", "2"))
                    await asyncio.sleep(retry_after)
                elif 500 <= resp.status < 600:
                    if attempt >= retries:
                        return None
                    await asyncio.sleep(1 + attempt)
                else:
                    return None
        attempt += 1

async def fetch_match_ids(session, cluster: str, puuid: str, start_ts: int, end_ts: int, cnt=50):
    base = f"https://{cluster}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids"

    print(base)
    ids, start, count = [], 0, 100
    while True:
        data = await _fetch_json(session, base, {
            "start": start, "count": count,
            "startTime": start_ts, "endTime": end_ts
        })
        print(data)
        if not data:
            break
        ids.extend(data)
        if len(data) < count:
            break
        start += count
        await asyncio.sleep(0.5)
    return ids[:cnt]

async def fetch_match_and_timeline(session, cluster: str, match_id: str):
    murl = f"https://{cluster}.api.riotgames.com/lol/match/v5/matches/{match_id}"
    turl = f"https://{cluster}.api.riotgames.com/lol/match/v5/matches/{match_id}/timeline"
    match = await _fetch_json(session, murl)
    timeline = await _fetch_json(session, turl)
    return match, timeline

async def fetch_champion_mastery(session, region: str, puuid: str):
    url = f"https://{region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}"
    return await _fetch_json(session, url)

async def fetch_summoner_by_puuid(session, region: str, puuid: str):
    url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
    headers = {"X-Riot-Token": RIOT_API_KEY}
    async with session.get(url, headers=headers) as resp:
        resp.raise_for_status()
        return await resp.json()

async def fetch_rank_by_puuid(session, region: str, puuid: str):
    url = f"https://{region}.api.riotgames.com/lol/league/v4/entries/by-puuid/{puuid}"
    headers = {"X-Riot-Token": RIOT_API_KEY}
    async with session.get(url, headers=headers) as resp:
        resp.raise_for_status()
        data = await resp.json()
        # return most relevant solo queue rank
        for entry in data:
            if entry["queueType"] == "RANKED_SOLO_5x5":
                return f"{entry['tier'].title()} {entry['rank']}"
        return "Unranked"
