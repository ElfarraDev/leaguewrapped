"use client";

import React, { useEffect, useMemo, useState } from "react";
import { WrappedData } from "@/types/wrapped.types";
import { useParallelScenarios, Scenario } from "./useParallelScenarios";
import { ScenarioSelector as PUScenarioSelector } from "./ScenarioSelector"; // <-- use named import
import ScenarioCard from "./ScenarioCard";
import { bedrockGenerate } from "@/services/bedrock.service";
import ScrollButton from "@/components/navigation/ScrollButton";

interface ParallelUniversePageProps {
  data: WrappedData;
  onScrollDown?: () => void;
}

const BG_CHAMP = "Ashe";

export default function ParallelUniversePage({
  data,
  onScrollDown,
}: ParallelUniversePageProps) {
  const [hoveredCard, setHoveredCard] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(0);

  const scenarios = useParallelScenarios(data);
  const currentScenario = scenarios[selectedScenario];

  const [aiInsightById, setAiInsightById] = useState<Record<string, string>>(
    {},
  );
  const [loadingById, setLoadingById] = useState<Record<string, boolean>>({});
  const [errorById, setErrorById] = useState<
    Record<string, string | undefined>
  >({});

  const coreSnapshot = useMemo(
    () => ({
      summoner: data.SummonerName,
      region: data.Region,
      rank: data.Rank,
      games: data.GamesPlayed,
      wins: data.Wins,
      losses: data.Losses,
      winRate: data.WinRate,
      kda: data.KDA,
      killsPerGame: data.KillsPerGame,
      deathsPerGame: data.DeathsPerGame,
      assistsPerGame: data.AssistsPerGame,
      kp: data.KillParticipation,
      dpm: data.DamagePerMinute,
      gpm: data.Economy?.GoldPerMinute,
      csPerMin: data.Economy?.CSPerMinute,
      visionScorePerGame:
        (data.Vision?.VisionScore ?? 0) / Math.max(1, data.GamesPlayed),
      controlWardsPerGame:
        (data.Vision?.ControlWards ?? 0) / Math.max(1, data.GamesPlayed),
      topChamps: data.BestChampionsByWinRate?.slice(0, 5)?.map((c) => ({
        name: c.Name,
        wr: c.WinRate,
        games: c.GamesPlayed,
        kda: c.KDA,
      })),
      tiltFactor: data.ai_coach?.tilt_analysis?.tilt_likelihood,
      worstStreak: data.ai_coach?.tilt_analysis?.worst_streak,
      earlyDeaths:
        data.ai_coach?.behavior_patterns?.early_game?.deaths_before_10_rate,
      facecheckDeaths:
        data.ai_coach?.behavior_patterns?.positioning_analysis
          ?.facecheck_deaths,
      riverDeaths:
        data.ai_coach?.behavior_patterns?.positioning_analysis?.river_deaths,
      csAt10: data.ai_coach?.behavior_patterns?.early_game?.cs_at_10_avg,
      deathVariance: data.ai_coach?.consistency?.death_variance,
      aggression: data.player_dna?.aggression,
      farmPriority: data.player_dna?.farm_priority,
      survivability: data.player_dna?.survivability,
      visionControl: data.player_dna?.vision_control,
      consistency: data.player_dna?.consistency,
      tiltVuln: data.player_dna?.tilt_vulnerability,
    }),
    [data],
  );

  const buildScenarioPrompt = (scenario: Scenario) => {
    let specificContext = "";

    switch (scenario.id) {
      case "tilt-control":
        specificContext = `
TILT METRICS:
- Tilt likelihood: ${((coreSnapshot.tiltFactor ?? 0) * 100).toFixed(0)}%
- Worst loss streak: ${coreSnapshot.worstStreak ?? 0} games
- Post-loss performance drops significantly
- Tilt vulnerability score: ${coreSnapshot.tiltVuln ?? 50}/100

KEY INSIGHT: Player has proven mental game weakness. Needs concrete pre-game and post-loss rituals.`;
        break;

      case "death-reduction":
        specificContext = `
DEATH PATTERNS:
- Early deaths (pre-10min): ${coreSnapshot.earlyDeaths?.toFixed(2) ?? 0}/game
- Facecheck deaths: ${coreSnapshot.facecheckDeaths ?? 0} total
- River deaths: ${coreSnapshot.riverDeaths ?? 0} total
- Avg deaths: ${coreSnapshot.deathsPerGame.toFixed(1)}/game
- Survivability DNA: ${coreSnapshot.survivability ?? 50}/100 (LOW)

KEY INSIGHT: Deaths are preventable through better vision usage and respect for fog of war.`;
        break;

      case "champion-focus":
        specificContext = `
CHAMPION MASTERY:
- Total unique champions: ${data.ChampionPool?.length ?? 0}
- Top 3 champions: ${
          coreSnapshot.topChamps
            ?.slice(0, 3)
            .map((c) => `${c.name} (${c.wr.toFixed(1)}% WR)`)
            .join(", ") ?? "N/A"
        }
- Farm priority DNA: ${coreSnapshot.farmPriority ?? 50}/100

KEY INSIGHT: Deep mastery on fewer champs > surface knowledge on many.`;
        break;

      case "early-game-fix":
        specificContext = `
EARLY GAME LEAKS:
- Deaths before 10min: ${coreSnapshot.earlyDeaths?.toFixed(2) ?? 0}/game
- CS at 10min: ${coreSnapshot.csAt10?.toFixed(0) ?? 0}
- Target CS at 10min: 70+ (player averages ${coreSnapshot.csAt10?.toFixed(0) ?? 0})
- Aggression DNA: ${coreSnapshot.aggression ?? 50}/100

KEY INSIGHT: Early deaths create snowball effect. Laning phase discipline = game control.`;
        break;

      case "positioning-fix":
        specificContext = `
POSITIONING ERRORS:
- Total facecheck deaths: ${coreSnapshot.facecheckDeaths ?? 0}
- River deaths: ${coreSnapshot.riverDeaths ?? 0}
- Combined positioning deaths/game: ${(
          ((coreSnapshot.facecheckDeaths ?? 0) +
            (coreSnapshot.riverDeaths ?? 0)) /
          Math.max(1, coreSnapshot.games)
        ).toFixed(2)}
- Survivability DNA: ${coreSnapshot.survivability ?? 50}/100 (NEEDS WORK)

KEY INSIGHT: Most deaths are macro errors (facechecking, no vision, bad timing), not mechanical.`;
        break;

      case "consistency-boost":
        specificContext = `
CONSISTENCY ISSUES:
- Death variance: ${coreSnapshot.deathVariance?.toFixed(2) ?? 0} (HIGH)
- Consistency DNA: ${coreSnapshot.consistency ?? 50}/100 (LOW)

KEY INSIGHT: Huge variance between best/worst games. Need standardized pre-game routine.`;
        break;
    }

    const statsView = scenario.stats.map((s) => ({
      label: s.label,
      current: s.current,
      alternative: s.alternative,
      change: s.change,
      unit: s.unit,
    }));

    return `You are a Challenger-level League of Legends coach analyzing a ${coreSnapshot.rank} player's performance data.

SCENARIO: ${scenario.title}
${scenario.description}

STATISTICS:
${JSON.stringify(statsView, null, 2)}

PLAYER PROFILE:
${JSON.stringify(coreSnapshot, null, 2)}

${specificContext}

CRITICAL RULES:
- Write 2-3 sentences MAXIMUM
- Be SPECIFIC and ACTIONABLE with exact numbers
- Give ONE concrete micro-action the player can do NEXT GAME
- Use direct, confident language (no "could" or "might")
- Reference the actual stats (deaths, vision, CS, etc.)
- End with the single most impactful next step

OUTPUT (2-3 sentences only):`;
  };

  const fetchAIInsight = async (
    scenario: Scenario,
    opts?: { force?: boolean },
  ) => {
    if (!scenario) return;
    const id = scenario.id;
    if (!opts?.force && aiInsightById[id] && !errorById[id]) return;

    setLoadingById((p) => ({ ...p, [id]: true }));
    setErrorById((p) => ({ ...p, [id]: undefined }));

    try {
      const prompt = buildScenarioPrompt(scenario);
      const res = await bedrockGenerate({
        prompt,
        stats: {
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          playerRank: data.Rank,
          winRate: data.WinRate,
          kda: data.KDA,
        },
      });
      setAiInsightById((p) => ({ ...p, [id]: res.response.trim() }));
    } catch (e: any) {
      setErrorById((p) => ({
        ...p,
        [id]: e?.message || "Failed to generate insight",
      }));
    } finally {
      setLoadingById((p) => ({ ...p, [id]: false }));
    }
  };

  useEffect(() => {
    if (currentScenario) fetchAIInsight(currentScenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenario, scenarios.length]);

  if (!currentScenario || scenarios.length === 0) return null;

  const aiInsight = aiInsightById[currentScenario.id];
  const aiLoading = !!loadingById[currentScenario.id];
  const aiError = errorById[currentScenario.id];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-8 bg-[#0F1A24] text-white">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.20] pointer-events-none"
        style={{
          backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${BG_CHAMP}_0.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          filter: "grayscale(25%) blur(2px)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,26,36,0.85),rgba(15,26,36,1))]" />

      {/* Content with extra bottom padding so fixed button doesn’t overlap */}
      <div className="relative z-10 w-full max-w-6xl pb-28">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border border-[#C89B3C]/30">
            <div className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full animate-pulse" />
            <span className="text-[#C89B3C] font-semibold text-xs tracking-wider">
              PARALLEL UNIVERSE
            </span>
          </div>
          <h2 className="text-5xl font-black text-white mb-3">
            What If<span className="text-[#C89B3C]">?</span>
          </h2>
          <p className="text-[#A0ADB7] text-lg">
            Data-driven scenarios showing your untapped potential
          </p>
        </div>

        {/* Non-scrollable, wrapping selector */}
        <PUScenarioSelector
          scenarios={scenarios}
          selectedIndex={selectedScenario}
          onSelect={setSelectedScenario}
        />

        <div className="mt-8">
          <ScenarioCard
            scenario={currentScenario}
            isHovered={hoveredCard}
            onHoverChange={setHoveredCard}
            ai={{
              loading: aiLoading,
              error: aiError,
              insight: aiInsight ?? currentScenario.insight,
              refresh: () => fetchAIInsight(currentScenario, { force: true }),
            }}
          />
        </div>
      </div>

      {/* Fixed scroll button */}
      {onScrollDown && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
          <ScrollButton onClick={onScrollDown} />
        </div>
      )}
    </div>
  );
}
