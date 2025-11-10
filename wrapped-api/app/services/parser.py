from collections import Counter

def _safe_div(n, d):
    return n / d if d else 0.0


def extract_stats(match, timeline, puuid):
    """
    Per-match extract that powers everything downstream.
    """
    if not match or "info" not in match:
        return None

    info = match["info"]
    parts = info.get("participants", [])
    me = next((p for p in parts if p.get("puuid") == puuid), None)
    if not me:
        return None

    duration_s = info.get("gameDuration", 0)
    end_ts = info.get("gameEndTimestamp") or info.get("gameCreation", 0)
    my_team = me.get("teamId")
    team_kills = sum(p.get("kills", 0) for p in parts if p.get("teamId") == my_team)

    ch = me.get("challenges", {}) or {}

    dragon_types = Counter()
    elder_drags = 0
    killstreaks_ended = 0
    bounty_collected = 0

    # 🕒 Parse timeline events
    if timeline and "info" in timeline:
        my_pid = me.get("participantId")
        for frame in timeline["info"].get("frames", []):
            for e in frame.get("events", []):
                if e.get("type") == "ELITE_MONSTER_KILL" and e.get("killerId") == my_pid and e.get("monsterType") == "DRAGON":
                    subtype = e.get("monsterSubType", "UNKNOWN")
                    if subtype == "ELDER_DRAGON":
                        elder_drags += 1
                    dragon_types[subtype] += 1
                if e.get("type") == "CHAMPION_KILL" and e.get("killerId") == my_pid:
                    b = e.get("shutdownBounty", 0)
                    if b > 0:
                        killstreaks_ended += 1
                        bounty_collected += b

    # 🧮 Derived stats
    cs = me.get("totalMinionsKilled", 0) + me.get("neutralMinionsKilled", 0)
    gpm = ch.get("goldPerMinute")
    if gpm is None:
        gpm = _safe_div(me.get("goldEarned", 0), duration_s / 60 if duration_s else 0)
    dpm = ch.get("damagePerMinute")

    # 🟢 Compute team & game damage context
    team_damage_totals = {}
    for team in info.get("teams", []):
        tid = team["teamId"]
        dmg = sum(p["totalDamageDealtToChampions"] for p in parts if p["teamId"] == tid)
        team_damage_totals[tid] = dmg

    player_team_damage = team_damage_totals.get(my_team, 0)
    team_data = [
        {
            "summonerName": p["summonerName"],
            "kills": p["kills"],
            "deaths": p["deaths"],
            "totalDamageDealtToChampions": p["totalDamageDealtToChampions"],
        }
        for p in parts
        if p["teamId"] == my_team
    ]

    all_participants = [
        {
            "summonerName": p["summonerName"],
            "kills": p["kills"],
            "deaths": p["deaths"],
            "teamId": p["teamId"],
        }
        for p in parts
    ]

    # 🧱 Build return object
    return {
        "win": bool(me.get("win")),
        "champion": me.get("championName"),
        "role": (me.get("teamPosition") or "UNKNOWN"),
        "duration_s": duration_s,
        "end_ts": end_ts,

        "kills": me.get("kills", 0),
        "deaths": me.get("deaths", 0),
        "assists": me.get("assists", 0),

        "doubleKills": me.get("doubleKills", 0),
        "tripleKills": me.get("tripleKills", 0),
        "quadraKills": me.get("quadraKills", 0),
        "pentaKills": me.get("pentaKills", 0),
        "longestSpree": me.get("largestKillingSpree", me.get("longestKillingSpree", 0)),

        "barons": me.get("baronKills", 0),
        "dragons": me.get("dragonKills", 0),
        "elder_dragons": elder_drags,
        "riftHeralds": ch.get("riftHeraldTakedowns", 0),

        "turrets": me.get("turretTakedowns", 0),
        "inhibitors": me.get("inhibitorTakedowns", 0),

        "visionScore": me.get("visionScore", 0),
        "wardsPlaced": me.get("wardsPlaced", 0),
        "wardsKilled": me.get("wardsKilled", 0),
        "controlWardsPlaced": me.get("controlWardsPlaced", 0),

        "turretPlates": ch.get("turretPlatesTaken", 0),
        "firstBlood": bool(me.get("firstBloodKill", False)),
        "soloKills": ch.get("soloKills", 0),

        "goldEarned": me.get("goldEarned", 0),
        "goldPerMinute": gpm,
        "goldSpent": me.get("goldSpent", 0),
        "cs": cs,
        "csPerMinute": _safe_div(cs, duration_s / 60 if duration_s else 0),

        "damagePerMinute": dpm,
        "totalDamageDealtToChampions": me.get("totalDamageDealtToChampions", 0),
        "totalDamageTaken": me.get("totalDamageTaken", 0),
        "totalTimeSpentDead": me.get("totalTimeSpentDead", 0),

        "summonerName": me.get("summonerName", "Unknown"),

        "teamKills": team_kills,
        "killParticipation": _safe_div(me.get("kills", 0) + me.get("assists", 0), team_kills) if team_kills else 0.0,

        "dragon_types": dict(dragon_types),
        "killstreaks_ended": killstreaks_ended,
        "bounty_collected": bounty_collected,

        "gameEndedInEarlySurrender": info.get("gameEndedInEarlySurrender", False),
        "gameEndedInSurrender": info.get("gameEndedInSurrender", False),
        "teamId": my_team,

        # new fields for downstream analytics
        "team_total_damage": player_team_damage,
        "team_data": team_data,
        "all_participants": all_participants,
    }
