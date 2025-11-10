def compute_additional_player_metrics(matches: list[dict]):
    stats: dict = {}

    total_games = len(matches)
    if not total_games:
        # sensible zero-ish defaults
        return {
            "avg_damage_dealt": 0.0,
            "avg_damage_taken": 0.0,
            "total_time_spent_dead": 0,
            "highest_deaths_game": 0,
            "highest_kills_game": 0,
            "lowest_damage_game": 0,
            "highest_damage_game": 0,
            "games_with_more_deaths_than_kills": 0,
            "games_with_zero_kills": 0,
            "gameEndedInEarlySurrender": 0,
            "gameEndedInSurrender": 0,
            "damage_share": 0.0,
            "games_with_most_deaths_on_team": 0,
            "avg_gold_spent_percentage": 0.0,
            "games_with_most_deaths_in_game": 0,
            "worst_performance": {},
            "best_performance": {},
        }

    # accumulators
    sum_dmg_dealt = 0
    sum_dmg_taken = 0
    sum_time_dead = 0

    highest_deaths = 0
    highest_kills = 0
    lowest_damage = None  # set on first valid value
    highest_damage = 0

    more_deaths_than_kills = 0
    zero_kills = 0
    early_surrenders = 0
    surrenders = 0

    # damage share & gold spent %
    share_sum = 0.0
    share_count = 0

    gold_spent_ratio_sum = 0.0
    gold_spent_ratio_count = 0

    # team-relative
    most_deaths_games = 0

    for m in matches:
        kills = int(m.get("kills", 0) or 0)
        deaths = int(m.get("deaths", 0) or 0)
        dmg_dealt = int(m.get("totalDamageDealtToChampions", 0) or 0)
        dmg_taken = int(m.get("totalDamageTaken", 0) or 0)
        time_dead = int(m.get("totalTimeSpentDead", 0) or 0)

        sum_dmg_dealt += dmg_dealt
        sum_dmg_taken += dmg_taken
        sum_time_dead += time_dead

        highest_deaths = max(highest_deaths, deaths)
        highest_kills = max(highest_kills, kills)

        lowest_damage = dmg_dealt if lowest_damage is None else min(lowest_damage, dmg_dealt)
        highest_damage = max(highest_damage, dmg_dealt)

        if deaths > kills:
            more_deaths_than_kills += 1
        if kills == 0:
            zero_kills += 1

        if m.get("gameEndedInEarlySurrender"):
            early_surrenders += 1
        if m.get("gameEndedInSurrender"):
            surrenders += 1

        # damage share (player damage / team total)
        team_total = m.get("team_total_damage", 0) or 0
        if team_total > 0:
            share_sum += (dmg_dealt / team_total)
            share_count += 1

        # avg gold spent percentage (goldSpent / goldEarned)
        earned = float(m.get("goldEarned", 0) or 0)
        spent = float(m.get("goldSpent", 0) or 0)
        if earned > 0:
            gold_spent_ratio_sum += (spent / earned)
            gold_spent_ratio_count += 1

        # games with most deaths on team
        team = m.get("team_data", [])
        if team:
            max_team_deaths = max(int(p.get("deaths", 0) or 0) for p in team)
            if deaths == max_team_deaths:
                most_deaths_games += 1

    # 🧮 games with most deaths in the entire match
    most_deaths_in_game = 0
    for m in matches:
        all_participants = m.get("all_participants", [])
        if not all_participants:
            continue
        max_deaths_game = max(p.get("deaths", 0) for p in all_participants)
        if m.get("deaths", 0) == max_deaths_game:
            most_deaths_in_game += 1

    # ✅ finalize base stats
    stats["avg_damage_dealt"] = round(sum_dmg_dealt / total_games, 2)
    stats["avg_damage_taken"] = round(sum_dmg_taken / total_games, 2)
    stats["total_time_spent_dead"] = int(sum_time_dead)

    stats["highest_deaths_game"] = int(highest_deaths)
    stats["highest_kills_game"] = int(highest_kills)
    stats["lowest_damage_game"] = int(lowest_damage or 0)
    stats["highest_damage_game"] = int(highest_damage)

    stats["games_with_more_deaths_than_kills"] = int(more_deaths_than_kills)
    stats["games_with_zero_kills"] = int(zero_kills)
    stats["gameEndedInEarlySurrender"] = int(early_surrenders)
    stats["gameEndedInSurrender"] = int(surrenders)
    stats["damage_share"] = round((share_sum / share_count) * 100, 2) if share_count else 0.0
    stats["avg_gold_spent_percentage"] = round((gold_spent_ratio_sum / gold_spent_ratio_count) * 100, 2) if gold_spent_ratio_count else 0.0
    stats["games_with_most_deaths_on_team"] = int(most_deaths_games)
    stats["games_with_most_deaths_in_game"] = int(most_deaths_in_game)

    # 🧮 Helper to compute KDA safely
    def kda_ratio(m):
        kills = m.get("kills", 0) or 0
        assists = m.get("assists", 0) or 0
        deaths = m.get("deaths", 0) or 0
        return (kills + assists) / max(deaths, 1)

    # ✅ filter valid matches (ignore <5min or early surrenders)
    valid_matches = [
        m for m in matches
        if not m.get("gameEndedInEarlySurrender", False)
        and m.get("duration_s", 0) >= 1000
    ]
    if not valid_matches:
        valid_matches = matches  # fallback

    # 🩸 Worst performance (lowest KDA)
    worst = min(valid_matches, key=kda_ratio)
    stats["worst_performance"] = {
        "champion": worst.get("champion", "Unknown"),
        "kda": f"{worst.get('kills', 0)}/{worst.get('deaths', 0)}/{worst.get('assists', 0)}",
        "damage_dealt": int(worst.get("totalDamageDealtToChampions", 0) or 0),
        "game_duration_minutes": round((worst.get("duration_s", 0) or 0) / 60, 1),
    }

    # ⚔️ Best performance (highest KDA)
    best = max(valid_matches, key=kda_ratio)
    stats["best_performance"] = {
        "champion": best.get("champion", "Unknown"),
        "kda": f"{best.get('kills', 0)}/{best.get('deaths', 0)}/{best.get('assists', 0)}",
        "damage_dealt": int(best.get("totalDamageDealtToChampions", 0) or 0),
        "game_duration_minutes": round((best.get("duration_s", 0) or 0) / 60, 1),
    }

    return stats
