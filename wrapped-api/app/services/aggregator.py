from collections import defaultdict, Counter
from datetime import datetime, timezone

def _safe_div(n, d):
    return n / d if d else 0.0

def _month_key(ms: int) -> str:
    if not ms:
        return "unknown"
    return datetime.fromtimestamp(ms/1000, tz=timezone.utc).strftime("%Y-%m")

def aggregate_global(matches: list[dict]):
    totals = defaultdict(float)
    months = defaultdict(lambda: {"games":0,"kills":0,"deaths":0,"assists":0,"dpm_sum":0.0})

    total_damage = 0
    total_duration_minutes = 0
    longest_streak = 0
    current_streak = 0

    for m in matches:
        for k in ["kills","deaths","assists","barons","dragons","elder_dragons","riftHeralds",
                  "turrets","inhibitors","wardsPlaced","wardsKilled","controlWardsPlaced",
                  "turretPlates","soloKills","goldEarned","cs",
                  "doubleKills","tripleKills","quadraKills","pentaKills",
                  "killstreaks_ended","bounty_collected","visionScore"]:
            totals[k] += m.get(k, 0)

        totals["wins"] += 1 if m["win"] else 0
        totals["matches"] += 1
        totals["duration_s"] += m.get("duration_s", 0)
        totals["firstBloods"] += 1 if m.get("firstBlood") else 0

        # --- Damage tracking ---
        dmg = m.get("totalDamageDealtToChampions", 0)
        total_damage += dmg
        dur_min = m.get("duration_s", 0) / 60
        total_duration_minutes += dur_min

        if m.get("win"):
            current_streak += 1
            longest_streak = max(longest_streak, current_streak)
        else:
            current_streak = 0

        mo = _month_key(m.get("end_ts"))
        months[mo]["games"] += 1
        months[mo]["kills"] += m["kills"]
        months[mo]["deaths"] += m["deaths"]
        months[mo]["assists"] += m["assists"]
        months[mo]["dpm_sum"] += (m.get("damagePerMinute") or 0.0)

    totals["losses"] = totals["matches"] - totals["wins"]
    totals["win_rate"] = round(_safe_div(totals["wins"], totals["matches"]) * 100, 1)
    totals["avg_kda"] = round(_safe_div(totals["kills"] + totals["assists"], totals["deaths"] if totals["deaths"] else 1), 2)

    totals["DamageDealt"] = total_damage
    totals["DamagePerMinute"] = round(_safe_div(total_damage, total_duration_minutes), 2) if total_duration_minutes else 0.0

    totals["LongestWinStreak"] = int(longest_streak)

    seconds = int(totals["duration_s"])
    totals["time_played"] = {
        "seconds": seconds,
        "minutes": seconds // 60,
        "hours": round(seconds / 3600, 2),
        "days": round(seconds / 86400, 2)
    }

    monthly_trends = []
    for mo, v in sorted(months.items()):
        d = v["deaths"] or 1
        monthly_trends.append({
            "month": mo,
            "games": v["games"],
            "kda": round((v["kills"]+v["assists"]) / d, 2),
            "dpm": round(_safe_div(v["dpm_sum"], v["games"]), 2) if v["games"] else 0.0
        })

    totals["kill_participation_avg"] = round(_safe_div(sum(m["killParticipation"] for m in matches), len(matches)) * 100, 1)
    totals["gold_per_min_avg"] = round(_safe_div(sum(m.get("goldPerMinute") or 0.0 for m in matches), len(matches)), 2)
    totals["cs_per_min_avg"] = round(_safe_div(sum(m.get("csPerMinute") or 0.0 for m in matches), len(matches)), 2)

    monthly_activity = [{"month": mo, "games": v["games"]} for mo, v in sorted(months.items())]

    return dict(totals), monthly_trends, monthly_activity


def champion_role_analytics(matches: list[dict], champ_tags_map: dict):
    champ = defaultdict(lambda: {"games":0,"wins":0,"kills":0,"deaths":0,"assists":0})
    roles = defaultdict(lambda: {"games":0,"wins":0})
    dragon_types_total = Counter()

    for m in matches:
        c, r = m["champion"], m["role"]

        ce = champ[c]
        ce["games"] += 1
        ce["wins"]  += 1 if m["win"] else 0
        ce["kills"] += m["kills"]
        ce["deaths"]+= m["deaths"]
        ce["assists"]+= m["assists"]

        re = roles[r]
        re["games"] += 1
        re["wins"]  += 1 if m["win"] else 0

        dragon_types_total.update(m.get("dragon_types", {}))

    champ_summary = []
    for c, s in champ.items():
        wr = round(_safe_div(s["wins"], s["games"]) * 100, 1)
        kda = round(_safe_div(s["kills"]+s["assists"], s["deaths"] if s["deaths"] else 1), 2)
        tags = champ_tags_map.get(c, {}).get("tags", ["Unknown"])
        champ_summary.append({
            "champion": c,
            "games": s["games"],
            "win_rate": wr,
            "avg_kda": kda,
            "class": tags
        })
    champ_summary.sort(key=lambda x: x["games"], reverse=True)
    top10 = champ_summary[:10]

    total_games = sum(s["games"] for s in champ.values())
    one_trick = (top10[0]["games"]/total_games) >= 0.6 if total_games and top10 else False

    ordered_roles = []
    for r in ["TOP","JUNGLE","MIDDLE","BOTTOM","SUPPORT","UNKNOWN"]:
        g = roles[r]["games"]
        w = roles[r]["wins"]
        ordered_roles.append({"role": r, "games": g, "win_rate": round(_safe_div(w,g) * 100, 1) if g else 0.0})
    ordered_roles.sort(key=lambda x: x["games"], reverse=True)

    top_role = ordered_roles[0]["role"] if ordered_roles else "UNKNOWN"
    secondary_role = ordered_roles[1]["role"] if len(ordered_roles) > 1 else "UNKNOWN"

    return {
        "top_10_champions": top10,
        "one_trick": one_trick,
        "top_role": top_role,
        "secondary_role": secondary_role,
        "role_summary": ordered_roles,
        "dragon_breakdown": dict(dragon_types_total)
    }

def best_champions_with_mastery(matches: list[dict], mastery_list: list | None, key_to_name_map: dict):
    agg = defaultdict(lambda: {"games":0,"wins":0,"kills":0,"deaths":0,"assists":0})
    for m in matches:
        c = m["champion"]
        a = agg[c]
        a["games"] += 1
        a["wins"]  += 1 if m["win"] else 0
        a["kills"] += m["kills"]
        a["deaths"]+= m["deaths"]
        a["assists"]+= m["assists"]

    champ_points = defaultdict(int)
    for item in mastery_list or []:
        key = str(item.get("championId"))
        name = key_to_name_map.get(key)
        if name:
            champ_points[name] = item.get("championPoints", 0)

    rows = []
    for name, s in agg.items():
        wr = round(_safe_div(s["wins"], s["games"])*100, 1)
        kda = round(_safe_div(s["kills"]+s["assists"], s["deaths"] if s["deaths"] else 1), 2)
        rows.append({
            "champion": name,
            "games": s["games"],
            "win_rate": wr,
            "avg_kda": kda,
            "mastery_points": champ_points.get(name, 0)
        })
    rows.sort(key=lambda x: (x["games"], x["win_rate"], x["mastery_points"]), reverse=True)
    best_by_wr = sorted([r for r in rows if r["games"] >= 10], key=lambda x: x["win_rate"], reverse=True)[:5]
    return {"by_activity": rows[:10], "best_by_winrate_min10": best_by_wr}
