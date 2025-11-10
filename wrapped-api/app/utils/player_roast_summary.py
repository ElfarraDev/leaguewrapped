def build_player_data(summary: dict, formatted: dict) -> dict:
    """
    Extracts key, lightweight player profile data from the wrapped summary
    and computed stats, formatted for quick frontend access.
    """

    global_summary = summary.get("global_summary", {})
    extra = summary.get("extra_stats", {})
    params = summary.get("params", {})

    # 🧩 Build player_data structure
    return {
        "player_data": {
            "summoner_info": {
                "summoner_name": params.get("summonerName", ""),
                "summoner_level": summary.get("summoner_level", 0),
                "rank": summary.get("rank", "Unranked"),
            },
            "recent_match_stats": {
                "total_matches": int(global_summary.get("matches", 0)),
                "wins": int(global_summary.get("wins", 0)),
                "losses": int(global_summary.get("losses", 0)),
                "win_rate": float(global_summary.get("win_rate", 0)),
                "avg_kda": float(global_summary.get("avg_kda", 0)),
                "avg_deaths": round(global_summary.get("deaths", 0) / max(global_summary.get("matches", 1), 1), 2),
                "avg_damage_dealt": int(extra.get("avg_damage_dealt", 0)),
                "avg_damage_taken": int(extra.get("avg_damage_taken", 0)),
                "avg_vision_score": round(global_summary.get("visionScore", 0) / max(global_summary.get("matches", 1), 1), 2),
                "avg_cs_per_minute": round(global_summary.get("cs_per_min_avg", 0), 2),
                "avg_gold_earned": int(global_summary.get("goldEarned", 0) / max(global_summary.get("matches", 1), 1)),
            },
            "performance_highlights": {
                "most_played_champion": formatted.get("TopChampion", {}).get("Name", "Unknown"),
                "most_played_position": global_summary.get("most_common_role", "UNKNOWN"),
                "highest_deaths_game": extra.get("highest_deaths_game", 0),
                "lowest_damage_game": extra.get("lowest_damage_game", 0),
                "total_time_spent_dead": extra.get("total_time_spent_dead", 0),
                "rage_quit_count": extra.get("gameEndedInEarlySurrender", 0),
                "penta_kills": int(global_summary.get("pentaKills", 0)),
                "quadra_kills": int(global_summary.get("quadraKills", 0)),
                "double_kills": int(global_summary.get("doubleKills", 0)),
            },
            "embarrassing_stats": {
                "games_with_more_deaths_than_kills": extra.get("games_with_more_deaths_than_kills", 0),
                "games_with_zero_kills": extra.get("games_with_zero_kills", 0),
                "avg_gold_spent_percentage": extra.get("avg_gold_spent_percentage", 0.0),
                "ward_score_rank": "Average",  # TODO: add role-relative logic
                "damage_share": extra.get("damage_share", 0.0),
                "games_with_most_deaths_on_team": extra.get("games_with_most_deaths_on_team", 0),
                "games_with_most_deaths_in_game": extra.get("games_with_most_deaths_in_game", 0),
            },
            "recent_match_context": {
                "worst_performance": {
                    "champion": extra.get("worst_performance", {}).get("champion", "Unknown"),
                    "kda": extra.get("worst_performance", {}).get("kda", "0/0/0"),
                    "damage_dealt": extra.get("worst_performance", {}).get("damage_dealt", 0),
                    "game_duration_minutes": int(extra.get("worst_performance", {}).get("game_duration_minutes", 0)),
                },
                "best_performance": {
                    "champion": extra.get("best_performance", {}).get("champion", "Unknown"),
                    "kda": extra.get("best_performance", {}).get("kda", "0/0/0"),
                    "damage_dealt": extra.get("best_performance", {}).get("damage_dealt", 0),
                },
            },
        }
    }
