import sqlite3
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

DB_PATH = "cache.db"

@router.get("/cache")
def inspect_cache():
    """
    Inspect current cache.db contents.
    Summarizes all cached match data by PUUID.
    Returns: list of {puuid, num_matches, example_match}
    (Filtered to only players with >10 matches)
    """
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT key, data FROM cache")
    rows = cur.fetchall()
    conn.close()

    summary = {}
    for key, data in rows:
        if not key.startswith("match:"):
            continue

        try:
            match_json = json.loads(data)
            participants = match_json.get("metadata", {}).get("participants", [])
            match_id = key.split(":")[1]

            for puuid in participants:
                if puuid not in summary:
                    summary[puuid] = {
                        "num_matches": 0,
                        "example_match": match_id
                    }
                summary[puuid]["num_matches"] += 1

        except Exception:
            continue

    # ✅ filter PUUIDs with > 10 matches
    filtered = [
        {"puuid": puuid, **info}
        for puuid, info in summary.items()
        if info["num_matches"] > 10
    ]

    return JSONResponse({
        "cached_players": filtered,
        "total_eligible_players": len(filtered)
    })

