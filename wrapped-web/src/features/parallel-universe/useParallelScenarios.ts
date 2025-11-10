import { useMemo } from "react";
import { WrappedData } from "@/types/wrapped.types";

export interface ScenarioStat {
  label: string;
  current: string | number;
  alternative: string | number;
  unit: string;
  change: number;
  highlight?: boolean;
  isText?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  championImage: string | null;
  championName?: string;
  icon?: string;
  stats: ScenarioStat[];
  /** Base fallback insight; AI will overwrite in UI */
  insight: string;
}

export function useParallelScenarios(
  playerStats: WrappedData | null,
): Scenario[] {
  return useMemo(() => {
    if (!playerStats) return [];

    const {
      BestChampionsByWinRate: topChampions = [],
      GamesPlayed: totalGames = 0,
      WinRate: currentWinRate,
      KDA: currentKDA,
      DeathsPerGame: avgDeaths,
      ai_coach,
      player_dna,
      ChampionPool,
      KillsPerGame,
      AssistsPerGame,
    } = playerStats;

    const scenarios: Scenario[] = [];

    // SCENARIO 1: Tilt Control
    if (ai_coach?.tilt_analysis) {
      const { tilt_likelihood, worst_streak, post_loss_performance_delta } =
        ai_coach.tilt_analysis;
      const tiltWinRate = currentWinRate - post_loss_performance_delta * 5; // rough estimate
      const untiltedWinRate = currentWinRate + (currentWinRate - tiltWinRate);

      scenarios.push({
        id: "tilt-control",
        title: "Tilt Control",
        description: `Breaking the ${worst_streak}-game loss streak mentality`,
        championImage: topChampions[0]
          ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampions[0].Name}_0.jpg`
          : null,
        championName: topChampions[0]?.Name,
        stats: [
          {
            label: "Win Rate",
            current: currentWinRate.toFixed(1),
            alternative: Math.min(untiltedWinRate, 65).toFixed(1),
            unit: "%",
            change: Math.min(untiltedWinRate - currentWinRate, 17.6),
            highlight: true,
          },
          {
            label: "Tilt Factor",
            current: (tilt_likelihood * 100).toFixed(0),
            alternative: "20",
            unit: "%",
            change: 20 - tilt_likelihood * 100,
          },
          {
            label: "Worst Streak",
            current: worst_streak,
            alternative: 3,
            unit: "games",
            change: 3 - worst_streak,
          },
        ],
        insight: `Your ${(tilt_likelihood * 100).toFixed(0)}% tilt rate and ${worst_streak}-game loss streak show mental game leaks. After losses, your performance drops ${post_loss_performance_delta.toFixed(1)}x—reset with a break, dodge queue, or warmup before next game.`,
      });
    }

    // SCENARIO 2: Death Reduction
    if (ai_coach?.behavior_patterns) {
      const { positioning_analysis, early_game } = ai_coach.behavior_patterns;
      const facecheckDeaths = positioning_analysis?.facecheck_deaths || 0;
      const earlyDeaths = early_game?.deaths_before_10_min || 0;
      const deathsReduced = 2;
      const newAvgDeaths = Math.max(3, avgDeaths - deathsReduced);
      const newKDA = (KillsPerGame + AssistsPerGame) / newAvgDeaths;
      const kdaGain = newKDA - currentKDA;
      const projectedWinRate = Math.min(currentWinRate + kdaGain * 4, 70);

      scenarios.push({
        id: "death-reduction",
        title: "Death Control",
        description: "Reducing deaths by 2 per game through positioning",
        championImage: topChampions[0]
          ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampions[0].Name}_0.jpg`
          : null,
        championName: topChampions[0]?.Name,
        stats: [
          {
            label: "Avg Deaths",
            current: avgDeaths.toFixed(1),
            alternative: newAvgDeaths.toFixed(1),
            unit: "/game",
            change: newAvgDeaths - avgDeaths,
            highlight: true,
          },
          {
            label: "KDA",
            current: currentKDA.toFixed(2),
            alternative: newKDA.toFixed(2),
            unit: "",
            change: kdaGain,
          },
          {
            label: "Win Rate",
            current: currentWinRate.toFixed(1),
            alternative: projectedWinRate.toFixed(1),
            unit: "%",
            change: projectedWinRate - currentWinRate,
          },
        ],
        insight: `You die ${earlyDeaths} times before 10min with ${facecheckDeaths} facecheck deaths. Ward before entering fog, track enemy JG, and respect river/fog. Target: ${newAvgDeaths.toFixed(1)} deaths/game = ${projectedWinRate.toFixed(1)}% WR.`,
      });
    }

    // (REMOVED) SCENARIO 3: Vision Mastery — per request.

    // SCENARIO 4: Champion Pool Focus
    if (topChampions.length > 0) {
      const top3 = topChampions.slice(0, 3);
      const top3Games = top3.reduce((s, c) => s + c.GamesPlayed, 0);
      const top3Wins = top3.reduce(
        (s, c) => s + Math.round((c.GamesPlayed * c.WinRate) / 100),
        0,
      );
      const focusedWinRate = (top3Wins / Math.max(1, top3Games)) * 100;
      const championMastery = player_dna?.lane_cs_power || 50;

      scenarios.push({
        id: "champion-focus",
        title: "Champion Mastery",
        description: `Focusing on your top 3 champions only`,
        championImage: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampions[0].Name}_0.jpg`,
        championName: topChampions[0].Name,
        stats: [
          {
            label: "Win Rate",
            current: currentWinRate.toFixed(1),
            alternative: focusedWinRate.toFixed(1),
            unit: "%",
            change: focusedWinRate - currentWinRate,
            highlight: true,
          },
          {
            label: "Champion Pool",
            current: ChampionPool?.length || 0,
            alternative: 3,
            unit: "champs",
            change: 3 - (ChampionPool?.length || 0),
          },
          {
            label: "Mastery Score",
            current: championMastery,
            alternative: Math.min(championMastery + 25, 100),
            unit: "/100",
            change: Math.min(25, 100 - championMastery),
          },
        ],
        insight: `Your top 3 (${top3.map((c) => c.Name).join(", ")}) have ${focusedWinRate.toFixed(1)}% WR on ${top3Games} games. Deep mastery > broad pool. Ban counters, dodge autofill, spam these 3 for faster climb.`,
      });
    }

    // SCENARIO 5: Early Game Discipline
    if (ai_coach?.behavior_patterns?.early_game) {
      const { deaths_before_10_rate, cs_at_10_avg } =
        ai_coach.behavior_patterns.early_game;
      const currentEarlyDeaths = deaths_before_10_rate;
      const targetEarlyDeaths = Math.max(0.5, currentEarlyDeaths - 1);
      const csBoost = 15;
      const targetCS = cs_at_10_avg + csBoost;
      const earlyWinRateBoost = 6;

      scenarios.push({
        id: "early-game-fix",
        title: "Early Game Discipline",
        description: "Surviving laning phase and hitting CS benchmarks",
        championImage: topChampions[0]
          ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampions[0].Name}_0.jpg`
          : null,
        championName: topChampions[0]?.Name,
        stats: [
          {
            label: "Deaths @ 10min",
            current: currentEarlyDeaths.toFixed(2),
            alternative: targetEarlyDeaths.toFixed(2),
            unit: "/game",
            change: targetEarlyDeaths - currentEarlyDeaths,
            highlight: true,
          },
          {
            label: "CS @ 10min",
            current: cs_at_10_avg.toFixed(0),
            alternative: targetCS.toFixed(0),
            unit: "cs",
            change: csBoost,
          },
          {
            label: "Win Rate",
            current: currentWinRate.toFixed(1),
            alternative: (currentWinRate + earlyWinRateBoost).toFixed(1),
            unit: "%",
            change: earlyWinRateBoost,
          },
        ],
        insight: `You're dying ${currentEarlyDeaths.toFixed(2)}x before 10min and averaging ${cs_at_10_avg.toFixed(0)} CS. Respect enemy cooldowns, ward at 2:30, don't force trades without vision. Target: ${targetCS} CS @ 10 + <1 death = lane control = +${earlyWinRateBoost}% WR.`,
      });
    }

    // SCENARIO 6: Positioning Masterclass
    if (ai_coach?.behavior_patterns?.positioning_analysis) {
      const { facecheck_deaths, river_deaths } =
        ai_coach.behavior_patterns.positioning_analysis;
      const totalPositionDeaths = (facecheck_deaths || 0) + (river_deaths || 0);
      const deathsPerGame = totalPositionDeaths / Math.max(1, totalGames);
      const improvedDeathsPerGame = deathsPerGame * 0.4;
      const newAvgDeaths = avgDeaths - (deathsPerGame - improvedDeathsPerGame);
      const newKDA =
        (KillsPerGame + AssistsPerGame) / Math.max(0.1, newAvgDeaths);
      const winRateBoost = (newKDA - currentKDA) * 3.5;

      scenarios.push({
        id: "positioning-fix",
        title: "Positioning Masterclass",
        description: "Eliminating avoidable positioning deaths",
        championImage: null,
        icon: "🎯",
        stats: [
          {
            label: "Positioning Deaths",
            current: deathsPerGame.toFixed(2),
            alternative: improvedDeathsPerGame.toFixed(2),
            unit: "/game",
            change: improvedDeathsPerGame - deathsPerGame,
            highlight: true,
          },
          {
            label: "Total KDA",
            current: currentKDA.toFixed(2),
            alternative: newKDA.toFixed(2),
            unit: "",
            change: newKDA - currentKDA,
          },
          {
            label: "Win Rate",
            current: currentWinRate.toFixed(1),
            alternative: Math.min(currentWinRate + winRateBoost, 65).toFixed(1),
            unit: "%",
            change: Math.min(winRateBoost, 17.6),
          },
        ],
        insight: `${facecheck_deaths || 0} facecheck deaths + river deaths = ${deathsPerGame.toFixed(1)}/game from bad positioning. Never facecheck without prio/vision. Hug walls, predict enemy pathing, respect fog. Fix this = ${Math.min(currentWinRate + winRateBoost, 65).toFixed(1)}% WR.`,
      });
    }

    // SCENARIO 7: Consistency Ceiling
    if (ai_coach?.consistency) {
      const { death_variance, performance_ceiling, performance_floor } =
        ai_coach.consistency;
      const currentConsistency = player_dna?.consistency || 45;
      const targetConsistency = Math.min(currentConsistency + 30, 85);
      const varianceReduction = death_variance * 0.5;
      const consistencyWinRate =
        currentWinRate + (targetConsistency - currentConsistency) * 0.25;

      scenarios.push({
        id: "consistency-boost",
        title: "Performance Consistency",
        description: "Playing at your ceiling more often",
        championImage: topChampions[0]
          ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampions[0].Name}_0.jpg`
          : null,
        championName: topChampions[0]?.Name,
        stats: [
          {
            label: "Consistency",
            current: currentConsistency,
            alternative: targetConsistency,
            unit: "/100",
            change: targetConsistency - currentConsistency,
            highlight: true,
          },
          {
            label: "Death Variance",
            current: death_variance.toFixed(2),
            alternative: varianceReduction.toFixed(2),
            unit: "",
            change: varianceReduction - death_variance,
          },
          {
            label: "Win Rate",
            current: currentWinRate.toFixed(1),
            alternative: Math.min(consistencyWinRate, 65).toFixed(1),
            unit: "%",
            change: Math.min(consistencyWinRate - currentWinRate, 17.6),
          },
        ],
        insight: `Your ceiling (${performance_ceiling.kda}) vs floor (${performance_floor.kda}) shows ${death_variance.toFixed(1)} death variance. Create pre-game checklist, warm up, VOD review bad games. Consistent performance = consistent climbing.`,
      });
    }

    return scenarios;
  }, [playerStats]);
}
