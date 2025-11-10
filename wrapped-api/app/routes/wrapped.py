import asyncio
import json
import time
from datetime import datetime

from app.services import (
    aggregator,
    cache,
    cache_dynamo,
    ddragon,
    parser,
    riot_api,
    riot_fetcher,
)
from app.services.account_api import get_account_by_riot_id
from app.utils.player_metrics import compute_additional_player_metrics
from app.utils.player_roast_summary import build_player_data
from app.utils.wrapped_formatter import process_wrapped_output
from fastapi import APIRouter, HTTPException, Path, Query
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/wrapped", tags=["Wrapped"])


def log(msg: str):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] [WRAPPED] {msg}")


async def generate_wrapped(
    region: str,
    puuid: str,
    start: str = "2025-01-01",
    end: str | None = None,
    summoner_name: str = None,
    count: int | None = None,
):
    start_ts = riot_api.to_unix(start)
    end_ts = riot_api.to_unix(end) if end else int(time.time())

    log(f"▶️ Starting wrapped generation for PUUID={puuid} (region={region})")
    log(f"Fetching data from {start} → {end or 'now'} (limit={count or 'full year'})")

    platform_region = riot_api.cluster_to_region(region)
    cluster = riot_api.region_to_cluster(platform_region)

    async with riot_api.session_ctx() as session:
        # 1️⃣ Load champion metadata
        log("Fetching latest DDragon patch info...")
        patch = await ddragon.get_latest_patch(session)
        log(f"✔️ Patch {patch} loaded. Fetching champion data...")
        champ_data, key_to_name = await ddragon.get_champions(session, patch)
        log(f"✔️ Loaded {len(champ_data)} champion entries.")

        # 2️⃣ Get match history
        log(f"Fetching match IDs from cluster {cluster}...")
        match_ids = await riot_api.fetch_match_ids(
            session, cluster, puuid, start_ts, end_ts, count or 9999
        )
        log(f"✔️ Retrieved {len(match_ids)} match IDs.")

        if not match_ids:
            raise HTTPException(
                status_code=404, detail="No matches found for this player."
            )

        # 3️⃣ Fetch and parse matches (optimized)
        log(f"⚡ Fetching {len(match_ids)} matches concurrently with caching...")

        # Fetch all matches + timelines concurrently (with rate limiting)
        fetched = await riot_fetcher.fetch_matches_concurrent(
            cluster, match_ids, include_timeline=True
        )

        results = []
        for idx, item in enumerate(fetched, start=1):
            if isinstance(item, Exception):
                log(f"⚠️ Match {match_ids[idx - 1]} failed to fetch: {item}")
                continue

            match, timeline = item
            data = parser.extract_stats(match, timeline, puuid)
            if data:
                results.append(data)
                log(
                    f"   ↳ Parsed match {match_ids[idx - 1]} (Kills={data.get('kills')}, Win={data.get('win')})"
                )
            else:
                log(
                    f"   ⚠️ Skipped match {match_ids[idx - 1]} (no participant data found)"
                )

        # 4️⃣ Aggregate stats
        log("Aggregating global and monthly stats...")
        global_summary, monthly_trends, monthly_activity = aggregator.aggregate_global(
            results
        )

        if summoner_name:
            global_summary["SummonerName"] = summoner_name

        log("Computing champion/role analytics...")
        champ_role_summary = aggregator.champion_role_analytics(results, champ_data)

        log("Fetching champion mastery info...")
        mastery = await riot_api.fetch_champion_mastery(
            session, region if region != "americas" else "na1", puuid
        )

        summoner_info = await riot_api.fetch_summoner_by_puuid(
            session, platform_region, puuid
        )
        summoner_level = summoner_info["summonerLevel"]

        summoner_rank = await riot_api.fetch_rank_by_puuid(
            session, platform_region, puuid
        )

        best_champs = aggregator.best_champions_with_mastery(
            results, mastery, key_to_name
        )

    log("✅ Wrapped generation complete!")
    log("------------------------------------------------------------")

    return {
        "params": {
            "region": region,
            "puuid": puuid,
            "patch": patch,
            "summonerName": summoner_name,
        },
        "global_summary": global_summary,
        "monthly_activity": monthly_activity,
        "trends": monthly_trends,
        "champion_role_summary": champ_role_summary,
        "best_champions": best_champs,
        "summoner_level": summoner_level,
        "raw_matches": results,
    }


@router.get("/roast_summary/{puuid}")
async def get_roast_summary(puuid: str, season: str = "2025"):
    """
    Retrieve only the roast_summary field from DynamoDB cache.
    """
    try:
        data = cache_dynamo.get_roast_summary(puuid, season)
        if not data:
            raise HTTPException(status_code=404, detail="No roast summary found.")
        return JSONResponse(data)

    except Exception as e:
        print(f"[ROAST_SUMMARY] ❌ Error retrieving: {e}")
        raise HTTPException(status_code=500, detail="Error fetching roast summary")


# # ✅ Normal route using PUUID
# @router.get("/{region}/{puuid}")
# async def get_wrapped_by_puuid(
#     region: str = Path(...),
#     puuid: str = Path(...),
#     start: str = Query("2025-01-01", description="Start date for match history, e.g. 2025-01-01"),
#     end: str | None = Query(None, description="Optional end date, e.g. 2025-12-31")
# ):
#     summary = await generate_wrapped(region, puuid, start, end)
#     return JSONResponse(summary)


@router.get("/{name}/{tag}")
async def wrapped_by_riot_id(
    name: str,
    tag: str,
    region: str = Query("na1"),
    count: int | None = Query(
        None,
        description="Optional limit on number of matches to fetch. If omitted, retrieves all matches for the year.",
    ),
):
    log(f"Processing wrapped request for {name}#{tag} (region={region}, count={count})")

    try:
        account = await get_account_by_riot_id(name, tag)
        puuid = account["puuid"]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching account: {str(e)}")

    cached = cache_dynamo.get_cached_wrapped(puuid, "2025")
    if cached:
        return JSONResponse(cached)

    cluster = riot_api.region_to_cluster(region)
    log(f"Using cluster: {cluster}")

    # 🧠 count now passed directly
    summary = await generate_wrapped(cluster, puuid, summoner_name=name, count=count)

    extra_stats = compute_additional_player_metrics(summary["raw_matches"])
    summary["extra_stats"] = extra_stats

    formatted = process_wrapped_output(summary)
    roast_summary = build_player_data(summary, formatted)

    formatted["roast_summary"] = roast_summary
    # formatted["summary"] = summary

    # ✅ Always cache, regardless of count
    cache_dynamo.put_cached_wrapped(
        puuid, formatted, "2025", region, roast_summary=roast_summary
    )

    return JSONResponse(formatted)
