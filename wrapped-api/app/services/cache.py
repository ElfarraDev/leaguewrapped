import sqlite3, json, os
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "cache.db")


def init_cache():
    """Create the cache table if it doesn’t exist."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS matches (
            match_id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            ts DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()


def get_match(match_id: str):
    """Return parsed match JSON if cached, else None."""
    with get_conn() as conn:
        cur = conn.execute("SELECT data FROM matches WHERE match_id=?", (match_id,))
        row = cur.fetchone()
        return json.loads(row[0]) if row else None


def set_match(match_id: str, data: dict):
    """Store parsed match JSON."""
    with get_conn() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO matches (match_id, data) VALUES (?, ?)",
            (match_id, json.dumps(data)),
        )
        conn.commit()
