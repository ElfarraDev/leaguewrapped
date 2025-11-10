import { useMemo } from "react";
import { WrappedData } from "@/types/wrapped.types";

export interface PlaystyleTrait {
  name: string;
  value: number; // 0-100
  description: string;
  color: string;
}

export interface DNAStrand {
  primary: string;
  secondary: string;
  traits: PlaystyleTrait[];
  archetype: {
    name: string;
    description: string;
  };
}

export function useDNAPlaystyle(data: WrappedData | null): DNAStrand | null {
  return useMemo(() => {
    if (!data) return null;

    const traits: PlaystyleTrait[] = [];

    // Aggression
    const avgKills = data.KillsPerGame || 0;
    const firstBloods = data.CombatStats?.FirstBloods || 0;
    const aggression = Math.min(
      100,
      (avgKills / 10) * 50 +
        (firstBloods / Math.max(1, data.GamesPlayed)) * 100 * 50,
    );
    traits.push({
      name: "Aggression",
      value: Math.round(aggression),
      description:
        aggression > 70
          ? "You're a hunter, always looking for the next kill"
          : aggression > 40
            ? "You pick your fights carefully"
            : "You prefer safer, calculated plays",
      color: "#DC4446",
    });

    // Team Player
    const killParticipation = data.KillParticipation || 0;
    const assistRatio =
      data.AssistsPerGame / (data.KillsPerGame + data.AssistsPerGame + 0.01);
    const teamPlayer = Math.min(
      100,
      killParticipation * 0.7 + assistRatio * 30,
    );
    traits.push({
      name: "Team Player",
      value: Math.round(teamPlayer),
      description:
        teamPlayer > 70
          ? "Your team's success is your success"
          : teamPlayer > 40
            ? "You balance personal plays with team support"
            : "You're more of a solo carry player",
      color: "#0AC8B9",
    });

    // Objective Control
    const dragons = data.Objectives?.Dragons || 0;
    const barons = data.Objectives?.Barons || 0;
    const heralds = data.Objectives?.Heralds || 0;
    const totalObjectives = dragons + barons + heralds;
    const objectiveFocus = Math.min(
      100,
      (totalObjectives / Math.max(1, data.GamesPlayed) / 3) * 100,
    );
    traits.push({
      name: "Objective Control",
      value: Math.round(objectiveFocus),
      description:
        objectiveFocus > 70
          ? "Objectives win games, and you know it"
          : objectiveFocus > 40
            ? "You take objectives when the opportunity arises"
            : "You focus more on kills than objectives",
      color: "#8B5CF6",
    });

    // Farm Priority
    const csPerMin = data.Economy?.CSPerMinute || 0;
    const farmPriority = Math.min(100, (csPerMin / 8) * 100);
    traits.push({
      name: "Farm Priority",
      value: Math.round(farmPriority),
      description:
        farmPriority > 70
          ? "Gold per minute is your religion"
          : farmPriority > 40
            ? "You farm adequately for your role"
            : "You roam more than you farm",
      color: "#F59E0B",
    });

    // Survivability
    const avgDeaths = data.DeathsPerGame || 0;
    const survivability = Math.max(0, 100 - (avgDeaths / 8) * 100);
    traits.push({
      name: "Survivability",
      value: Math.round(survivability),
      description:
        survivability > 70
          ? "You value your life above all else"
          : survivability > 40
            ? "You take calculated risks"
            : "High risk, high reward is your motto",
      color: "#10B981",
    });

    // Vision Control
    const visionScore = data.Vision?.VisionScore || 0;
    const wardsPerGame = visionScore / Math.max(1, data.GamesPlayed);
    const visionControl = Math.min(100, (wardsPerGame / 50) * 100);
    traits.push({
      name: "Vision Control",
      value: Math.round(visionControl),
      description:
        visionControl > 70
          ? "Map vision is your sixth sense"
          : visionControl > 40
            ? "You ward when you remember"
            : "What's a control ward?",
      color: "#6366F1",
    });

    // Determine primary/secondary
    const sorted = [...traits].sort((a, b) => b.value - a.value);
    const primary = sorted[0]?.name ?? "Aggression";
    const secondary = sorted[1]?.name ?? "Team Player";

    // Archetype
    const archetype = determineArchetype(sorted);

    return { primary, secondary, traits: sorted, archetype };
  }, [data]);
}

function determineArchetype(traits: PlaystyleTrait[]): DNAStrand["archetype"] {
  const t = Object.fromEntries(traits.map((x) => [x.name, x.value])) as Record<
    string,
    number
  >;

  const ag = t["Aggression"] || 0;
  const tp = t["Team Player"] || 0;
  const obj = t["Objective Control"] || 0;
  const farm = t["Farm Priority"] || 0;
  const surv = t["Survivability"] || 0;
  const vis = t["Vision Control"] || 0;

  if (ag > 70 && surv < 50)
    return {
      name: "The Assassin",
      description:
        "You live for the thrill of the hunt. High risk plays and solo kills define your games.",
    };

  if (tp > 70 && vis > 60)
    return {
      name: "The Enabler",
      description:
        "Your team's success is your success. You set up plays and keep vision control.",
    };

  if (farm > 70 && ag < 50)
    return {
      name: "The Farmer",
      description:
        "Gold per minute is your game. You scale to late game dominance through perfect CS.",
    };

  if (obj > 70)
    return {
      name: "The Strategist",
      description:
        "Kills are nice, but objectives win games. You understand the macro game.",
    };

  if (surv > 70 && tp > 60)
    return {
      name: "The Guardian",
      description:
        "You're the frontline that never breaks. Protecting your team is your calling.",
    };

  if (ag > 60 && farm > 60)
    return {
      name: "The Carry",
      description:
        "You're here to dominate. Farm, kills, and carrying your team to victory.",
    };

  if (ag > 60 && obj > 60)
    return {
      name: "The Playmaker",
      description:
        "You create opportunities and seize them. Your plays turn games around.",
    };

  const avg = (ag + tp + obj + farm + surv + vis) / 6;
  if (avg > 50 && avg < 70)
    return {
      name: "The Versatile",
      description:
        "Jack of all trades, master of none. You adapt to what your team needs.",
    };

  return {
    name: "The Wildcard",
    description:
      "Unpredictable and chaotic. Your games are a rollercoaster of highs and lows.",
  };
}
