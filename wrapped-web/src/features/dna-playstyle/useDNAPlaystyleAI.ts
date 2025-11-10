"use client";

import { useCallback, useMemo, useState } from "react";
import { bedrockGenerate } from "@/services/bedrock.service";
import type { WrappedData } from "@/types/wrapped.types";

export type AITrait = {
  name: string;
  value: number; // 0-100
  description: string;
  color: string; // hex
};

export type AIDNAResult = {
  archetype: { name: string; description: string };
  primary: string;
  secondary: string;
  traits: AITrait[]; // sorted high->low
  insight: string;
  suggestedChampion?: string;
};

function safeParseJSON(text: string): any {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  try {
    return JSON.parse(raw);
  } catch {}
  const s = raw.indexOf("{");
  const e = raw.lastIndexOf("}");
  if (s !== -1 && e !== -1 && e > s) {
    try {
      return JSON.parse(raw.slice(s, e + 1));
    } catch {}
  }
  throw new Error("AI response was not valid JSON.");
}

function getScore(traits: AITrait[], key: string, aliases: string[] = []) {
  const all = [key, ...aliases].map((s) => s.toLowerCase());
  const t = traits.find((x) => all.includes(x.name.toLowerCase()));
  return t ? Number(t.value) : 0;
}

function deriveArchetypeFromTraits(traits: AITrait[]) {
  const Agg = getScore(traits, "Aggression");
  const Team = getScore(traits, "Team Player", ["Teamwork", "Support"]);
  const Obj = getScore(traits, "Objective Control", ["Objectives", "Macro"]);
  const Farm = getScore(traits, "Farm Priority", ["Farming", "Economy"]);
  const Surv = getScore(traits, "Survivability", [
    "Durability",
    "Deaths Avoidance",
  ]);
  const Vis = getScore(traits, "Vision Control", ["Vision", "Warding"]);

  const avg = (Agg + Team + Obj + Farm + Surv + Vis) / 6;

  if (Agg > 70 && Surv < 50) {
    return {
      name: "The Assassin",
      description:
        "High pick pressure and risky skirmishes—thrives on picks and tempo windows.",
    };
  }
  if (Team > 70 && Vis > 60) {
    return {
      name: "The Enabler",
      description:
        "Playmaking through vision and setup—you tilt fights in your team’s favor.",
    };
  }
  if (Farm > 70 && Agg < 55) {
    return {
      name: "The Farmer",
      description:
        "Long game—reliable scaling and resource control into late power spikes.",
    };
  }
  if (Obj > 70) {
    return {
      name: "The Strategist",
      description:
        "Plays for plates, dragons, heralds, and barons—win-condition focused.",
    };
  }
  if (Surv > 70 && Team > 60) {
    return {
      name: "The Guardian",
      description:
        "Frontline anchor—peels, soaks pressure, keeps carries online.",
    };
  }
  if (Agg > 60 && Farm > 60) {
    return {
      name: "The Carry",
      description: "Resource-hungry, damage-forward—converts gold into wins.",
    };
  }
  if (Agg > 60 && Obj > 60) {
    return {
      name: "The Playmaker",
      description:
        "Forces action and turns skirmishes into objectives—tempo-driven.",
    };
  }
  if (avg >= 50 && avg <= 70) {
    return {
      name: "The Versatile",
      description:
        "Flexible profile—adapts to comps, lanes, and win conditions.",
    };
  }
  return {
    name: "The Wildcard",
    description:
      "Unpredictable game-to-game—big highs, big lows, hard to scout.",
  };
}

function mostPlayedChampionName(data: WrappedData | null): string | null {
  if (!data) return null;
  if (data.TopChampion?.Name) return data.TopChampion.Name;
  const list = data.BestChampionsByWinRate || [];
  if (list.length) {
    const most = [...list].sort(
      (a, b) => (b.GamesPlayed ?? 0) - (a.GamesPlayed ?? 0),
    )[0];
    return most?.Name ?? null;
  }
  return null;
}

function buildPrompt(stats: WrappedData): string {
  const snapshot = {
    summoner: stats.SummonerName,
    region: stats.Region,
    games: stats.GamesPlayed,
    wins: stats.Wins,
    losses: stats.Losses,
    winRate: stats.WinRate,
    kda: stats.KDA,
    kp: stats.KillParticipation,
    csPerMin: stats.Economy?.CSPerMinute,
    gpm: stats.Economy?.GoldPerMinute,
    dpm: stats.DamagePerMinute,
    visionScoreTotal: stats.Vision?.VisionScore,
    dragons: stats.Objectives?.Dragons,
    barons: stats.Objectives?.Barons,
    heralds: stats.Objectives?.Heralds,
    topChamps: (stats.BestChampionsByWinRate || []).slice(0, 5),
    mostPlayedChampion: mostPlayedChampionName(stats),
  };

  return `
You are an expert League analyst. Return a SINGLE JSON object ONLY.

Rules:
- Do NOT default to "The Assassin". Only pick Assassin if Aggression is highest AND Survivability < 50.
- Choose archetype strictly from trait scores; if balanced, prefer "The Versatile".
- Primary/secondary must be the two highest trait scores.

Schema:
{
  "archetype": { "name": "…", "description": "…" },
  "primary": "TraitName",
  "secondary": "TraitName",
  "traits": [
    {"name":"Aggression","value":0-100,"description":"…","color":"#HEX"},
    {"name":"Team Player","value":…,"description":"…","color":"#HEX"},
    {"name":"Objective Control","value":…,"description":"…","color":"#HEX"},
    {"name":"Farm Priority","value":…,"description":"…","color":"#HEX"},
    {"name":"Survivability","value":…,"description":"…","color":"#HEX"},
    {"name":"Vision Control","value":…,"description":"…","color":"#HEX"}
  ],
  "insight": "≤160 chars",
  "suggestedChampion": "ChampionName"
}

Player stats:
${JSON.stringify(snapshot)}
`;
}

export function useDNAPlaystyleAI(data: WrappedData | null) {
  const [ai, setAI] = useState<AIDNAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const canRun = useMemo(() => !!data && data.GamesPlayed > 0, [data]);

  const generate = useCallback(async () => {
    if (!canRun || !data) return;
    setLoading(true);
    setErr(null);
    try {
      const prompt = buildPrompt(data);
      const res = await bedrockGenerate({
        prompt,
        stats: {
          WR: data.WinRate,
          KDA: data.KDA,
          games: data.GamesPlayed,
          csPerMin: data.Economy?.CSPerMinute,
        },
      });

      const parsed = safeParseJSON(res.response || "");
      if (!parsed?.traits || !Array.isArray(parsed.traits)) {
        throw new Error("AI JSON missing traits.");
      }

      const normTraits: AITrait[] = parsed.traits
        .map(
          (t: any): AITrait => ({
            name: String(t.name ?? "Trait"),
            value: Math.max(0, Math.min(100, Number(t.value ?? 0))),
            description: String(t.description ?? ""),
            color: /^#([0-9A-F]{3}){1,2}$/i.test(t.color || "")
              ? t.color
              : "#C89B3C",
          }),
        )
        .sort((a: AITrait, b: AITrait) => b.value - a.value); // <-- typed params

      const fixedArch = deriveArchetypeFromTraits(normTraits);

      const result: AIDNAResult = {
        archetype: {
          name: String(parsed.archetype?.name ?? fixedArch.name),
          description: String(
            parsed.archetype?.description ?? fixedArch.description,
          ),
        },
        primary: String(parsed.primary ?? normTraits[0]?.name ?? "Aggression"),
        secondary: String(
          parsed.secondary ?? normTraits[1]?.name ?? "Team Player",
        ),
        traits: normTraits,
        insight: String(
          parsed.insight ??
            "Tighten your biggest strength to convert more wins.",
        ),
        suggestedChampion: parsed.suggestedChampion
          ? String(parsed.suggestedChampion)
          : undefined,
      };

      if (
        result.archetype.name === "The Assassin" &&
        !(
          getScore(normTraits, "Aggression") > 70 &&
          getScore(normTraits, "Survivability") < 50
        )
      ) {
        result.archetype = fixedArch;
      }

      setAI(result);
    } catch (e: any) {
      setErr(e?.message || "Failed to generate DNA");
    } finally {
      setLoading(false);
    }
  }, [canRun, data]);

  return {
    ai,
    loading,
    error,
    generate,
    regenerate: generate,
    ready: canRun,
    mostPlayedChampion: mostPlayedChampionName(data),
  };
}
