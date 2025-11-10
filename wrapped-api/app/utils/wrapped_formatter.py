from datetime import datetime
from calendar import month_abbr

def process_wrapped_output(data: dict) -> dict:
    """
    Transform the internal wrapped summary (from generate_wrapped)
    into the flattened, frontend-friendly JSON schema — while preserving
    all detailed info under `other_stats`.
    """

    params = data.get("params", {})
    global_summary = data.get("global_summary", {})
    champ_summary = data.get("champion_role_summary", {})
    best_champs = data.get("best_champions", {})
    monthly_trends = data.get("trends", [])
    monthly_activity = data.get("monthly_activity", [])
    extra = data.get("extra_stats", {})

    # 🕒 Time played normalization
    tp = global_summary.get("time_played", {})
    time_played = {
        "Hours": tp.get("hours", 0),
        "Days": tp.get("days", 0),
        "Minutes": tp.get("minutes", 0),
        "Seconds": tp.get("seconds", 0)
    }

    # 🗓 Monthly activity → include all months (fill 0s)
    full_months = {m: 0 for m in month_abbr[1:]}  # Jan–Dec
    for entry in monthly_activity:
        try:
            dt = datetime.strptime(entry["month"], "%Y-%m")
            full_months[month_abbr[dt.month]] = entry.get("games", 0)
        except Exception:
            continue

    # ⚔️ Top champion (most games)
    # ⚔️ Top champion (most games)
    top_champ = None
    if champ_summary.get("top_10_champions"):
        top = champ_summary["top_10_champions"][0]

        # Try to find matching champion in mastery-aware list
        mastery_points = 0
        for bc in best_champs.get("by_activity", []):
            if bc["champion"] == top["champion"]:
                mastery_points = bc.get("mastery_points", 0)
                break

        top_champ = {
            "Name": top["champion"],
            "MasteryPoints": mastery_points,
            "KDA": top.get("avg_kda", 0),
            "WinRate": top.get("win_rate", 0),
            "GamesPlayed": top.get("games", 0)
        }


    # 🧠 Best champions by winrate (>=10 games)
    best_by_wr = best_champs.get("best_by_winrate_min10", [])
    top_champ_wr_list = [
        {
            "Name": c["champion"],
            "GamesPlayed": c["games"],
            "WinRate": c["win_rate"],
            "KDA": c["avg_kda"],
            "MasteryPoints": c.get("mastery_points", 0)
        }
        for c in best_by_wr
    ]

    # 🐉 Objectives with detailed dragon info
    dragons_total = champ_summary.get("dragon_breakdown", {})
    objectives = {
        "Dragons": int(sum(dragons_total.values())),
        "Barons": int(global_summary.get("barons", 0)),
        "Heralds": int(global_summary.get("riftHeralds", 0)),
        "TurretPlates": int(global_summary.get("turretPlates", 0)),
        "DragonTypes": dragons_total
    }

    # 🔭 Performance profile (placeholder until implemented)
    performance_profile = {
        "Mechanics": 0,
        "Farm": 0,
        "Objective": 0,
        "Teamwork": 0,
        "Vision": 0
    }

    # 🎯 Multikill breakdown
    multikills = {
        "Pentakills": int(global_summary.get("pentaKills", 0)),
        "Quadrakills": int(global_summary.get("quadraKills", 0)),
        "TripleKills": int(global_summary.get("tripleKills", 0))
    }

    # 👁️ Vision-related
    vision = {
        "VisionScore": int(global_summary.get("visionScore", 0)),
        "WardsPlaced": int(global_summary.get("wardsPlaced", 0)),
        "WardsKilled": int(global_summary.get("wardsKilled", 0)),
        "ControlWards": int(global_summary.get("controlWardsPlaced", 0))
    }

    # 💰 Economy stats
    economy = {
        "GoldEarned": int(global_summary.get("goldEarned", 0)),
        "GoldPerMinute": global_summary.get("gold_per_min_avg", 0),
        "CSPerMinute": global_summary.get("cs_per_min_avg", 0)
    }

    # 🗡️ Combat stats
    combat = {
        "FirstBloods": int(global_summary.get("firstBloods", 0)),
        "SoloKills": int(global_summary.get("soloKills", 0)),
        "TowersDestroyed": int(global_summary.get("turrets", 0))
    }

    # 🗝️ Key insights
    key_insights = {
        "TotalKills": int(global_summary.get("kills", 0)),
        "TotalAssists": int(global_summary.get("assists", 0)),
        "GoldEarned": int(global_summary.get("goldEarned", 0)),
        "DamageDealt": int(global_summary.get("totalDamageDealtToChampions", 0)),  
        "WinStreak": int(global_summary.get("LongestWinStreak", 0)),    
        "GamesPlayed": int(global_summary.get("matches", 0))
    }

    # 🧩 Other champion pool info
    champ_pool = [
        {
            "Name": c["champion"],
            "GamesPlayed": c["games"],
            "WinRate": c["win_rate"]
        }
        for c in champ_summary.get("top_10_champions", [])
    ]

    # 🧮 High-level computed values
    kda = global_summary.get("avg_kda", 0)
    kills_per_game = round(global_summary.get("kills", 0) / max(global_summary.get("matches", 1), 1), 2)
    deaths_per_game = round(global_summary.get("deaths", 0) / max(global_summary.get("matches", 1), 1), 2)
    assists_per_game = round(global_summary.get("assists", 0) / max(global_summary.get("matches", 1), 1), 2)

    # 🧱 Collect unmapped data under other_stats
    used_fields = {
        "kills", "deaths", "assists", "matches", "wins", "losses",
        "win_rate", "avg_kda", "visionScore", "goldEarned", "cs",
        "barons", "dragons", "riftHeralds", "turretPlates", "pentaKills",
        "quadraKills", "tripleKills", "turrets", "soloKills",
        "controlWardsPlaced", "wardsPlaced", "wardsKilled", "firstBloods"
    }
    other_stats = {k: v for k, v in global_summary.items() if k not in used_fields}

    dpm = global_summary.get("DamagePerMinute") or global_summary.get("damagePerMinute")
    if not dpm:
        # fallback to monthly average if not present
        dpm = round(sum(m.get("dpm", 0) for m in monthly_trends) / max(len(monthly_trends), 1), 2)

        # 🧾 Final wrapped output
    output = {
        "SummonerName": params.get("summonerName", ""),
        "SummonerLevel": data.get("summoner_level", 0),
        "Rank": data.get("rank", "Unranked"),
        "Region": params.get("region", ""),
        "TimePlayed": time_played,
        "KDA": kda,
        "WinRate": global_summary.get("win_rate", 0),
        "KillsPerGame": kills_per_game,
        "DeathsPerGame": deaths_per_game,
        "AssistsPerGame": assists_per_game,
        "KillParticipation": global_summary.get("kill_participation_avg", 0),
        "Wins": int(global_summary.get("wins", 0)),
        "GamesPlayed": int(global_summary.get("matches", 0)),
        "Losses": int(global_summary.get("losses", 0)),
        "Multikills": multikills,
        "TopChampion": top_champ or {},
        "KDATrend": 0,
        "DamagePerMinute": dpm,
        "MonthlyActivity": full_months,
        "ChampionPool": champ_pool,
        "PerformanceProfile": performance_profile,
        "Objectives": objectives,

        # 🗡️ Combat & survivability
        "CombatStats": {
            "FirstBloods": int(global_summary.get("firstBloods", 0)),
            "SoloKills": int(global_summary.get("soloKills", 0)),
            "TowersDestroyed": int(global_summary.get("turrets", 0)),
            "HighestKillsGame": extra.get("highest_kills_game"),
            "HighestDeathsGame": extra.get("highest_deaths_game"),
            "TotalTimeSpentDead": extra.get("total_time_spent_dead"),
        },

        # 💰 Economy
        "Economy": {
            "GoldEarned": global_summary.get("goldEarned", 0),
            "GoldPerMinute": global_summary.get("gold_per_min_avg", 0),
            "CSPerMinute": global_summary.get("cs_per_min_avg", 0),
            "AverageDamageDealt": extra.get("avg_damage_dealt"),
            "AverageDamageTaken": extra.get("avg_damage_taken"),
            "AvgGoldSpentPercentage": extra.get("avg_gold_spent_percentage"),
        },

        # 👁️ Vision
        "Vision": vision,

        # 🔑 Key Insights
        "KeyInsights": {
            "TotalKills": int(global_summary.get("kills", 0)),
            "TotalAssists": int(global_summary.get("assists", 0)),
            "GoldEarned": int(global_summary.get("goldEarned", 0)),
            "DamageDealt": int(global_summary.get("totalDamageDealtToChampions", 0)),
            "WinStreak": int(global_summary.get("LongestWinStreak", 0)),
            "GamesPlayed": int(global_summary.get("matches", 0)),
            "DamageShare": extra.get("damage_share"),
            "HighestDamageGame": extra.get("highest_damage_game"),
            "LowestDamageGame": extra.get("lowest_damage_game"),
        },

        # 🕹️ Performance Highlights (NEW)
        "PerformanceHighlights": {
            "WorstPerformance": extra.get("worst_performance", {}),
            "BestPerformance": extra.get("best_performance", {}),
        },

        "BestChampionsByWinRate": top_champ_wr_list,
        "gameEndedInEarlySurrender": extra.get("gameEndedInEarlySurrender", 0),
        "gameEndedInSurrender": extra.get("gameEndedInSurrender", 0),

        # 📊 Unmapped but useful stats
        "other_stats": {
            **other_stats,
            "games_with_more_deaths_than_kills": extra.get("games_with_more_deaths_than_kills"),
            "games_with_zero_kills": extra.get("games_with_zero_kills"),
            "games_with_most_deaths_on_team": extra.get("games_with_most_deaths_on_team"),
            "games_with_most_deaths_in_game": extra.get("games_with_most_deaths_in_game"),

        }
    }

    return output
