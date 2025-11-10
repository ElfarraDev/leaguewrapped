"use client";

import React, { useState } from "react";
import { WrappedData } from "@/types/wrapped.types";
import ScrollButton from "@/components/navigation/ScrollButton";
import { bedrockGenerate } from "@/services/bedrock.service";

type Intensity = "mild" | "spicy" | "nuclear";
const INTENSITIES = {
  mild: {
    label: "Mild",
    color: "#0AC8B9",
    desc: "Friendly critique",
    champion: "Soraka",
  },
  spicy: {
    label: "Spicy",
    color: "#F0B232",
    desc: "Getting personal",
    champion: "Brand",
  },
  nuclear: {
    label: "Nuclear",
    color: "#DC4446",
    desc: "Uninstall worthy",
    champion: "Viego",
  },
} as const;

export default function RoastPage({
  data,
  onScrollDown,
}: {
  data: WrappedData;
  onScrollDown?: () => void;
}) {
  const [stage, setStage] = useState<"intro" | "select" | "loading" | "roast">(
    "intro",
  );
  const [intensity, setIntensity] = useState<Intensity>("spicy");
  const [roast, setRoast] = useState("");
  const [error, setError] = useState<string | null>(null);

  const buildPrompt = (mode: Intensity, stats: WrappedData) => {
    // Calculate rates
    const intRate =
      (stats.other_stats.games_with_more_deaths_than_kills /
        stats.GamesPlayed) *
      100;
    const zeroKillRate =
      (stats.other_stats.games_with_zero_kills / stats.GamesPlayed) * 100;
    const tiltRate =
      (stats.ai_coach?.tilt_analysis?.tilt_likelihood ?? 0) * 100;
    const controlWardsPerGame = stats.Vision.ControlWards / stats.GamesPlayed; // keep as number
    const facecheckDeaths =
      stats.ai_coach?.behavior_patterns?.positioning_analysis
        ?.facecheck_deaths ?? 0;
    const earlyDeaths =
      stats.ai_coach?.behavior_patterns?.early_game?.deaths_before_10_rate ?? 0;

    const core = {
      summoner: stats.SummonerName,
      rank: stats.Rank,
      games: stats.GamesPlayed,
      winRate: stats.WinRate,
      kda: stats.KDA,
      avgDeaths: stats.DeathsPerGame.toFixed(1),
      highestDeaths: stats.CombatStats?.HighestDeathsGame,
      zeroKillGames: stats.other_stats?.games_with_zero_kills,
      zeroKillRate: zeroKillRate.toFixed(1),
      intGames: stats.other_stats?.games_with_more_deaths_than_kills,
      intRate: intRate.toFixed(1),
      tiltRate: tiltRate.toFixed(0), // string for display
      worstStreak: stats.ai_coach?.tilt_analysis?.worst_streak ?? 0,
      facecheckDeaths,
      earlyDeaths: earlyDeaths.toFixed(2), // string for display
      controlWardsPerGame, // numeric to allow comparisons like === 0
      survivability: stats.player_dna?.survivability ?? 50,
      visionControl: stats.player_dna?.vision_control ?? 50,
    };

    if (mode === "mild") {
      return `You are a friendly League coach writing a playful one-liner roast for a ${core.rank} player.

CRITICAL: Output EXACTLY ONE SENTENCE (max 25 words). Use ONE stat with numbers. Be playful, not mean.

Stats: ${core.rank}, ${core.winRate}% WR, ${core.avgDeaths} deaths/game${
        core.controlWardsPerGame === 0
          ? `, ZERO control wards in ${core.games} games`
          : ""
      }${tiltRate > 60 ? `, ${core.tiltRate}% tilt rate` : ""}

Example: "With ${core.avgDeaths} deaths per game, you're basically running a charity for the enemy team!"

Write ONE playful roast:`;
    }

    if (mode === "spicy") {
      return `You are a witty League analyst writing a sarcastic one-liner for a ${core.rank} player.

CRITICAL: Output EXACTLY ONE SENTENCE (max 30 words). Pick the WORST stat, roast it with numbers.

Stats: ${core.rank}, ${core.winRate}% WR, ${core.intRate}% int rate${
        core.controlWardsPerGame === 0
          ? `, ZERO control wards in ${core.games} games`
          : ""
      }${tiltRate > 60 ? `, ${core.tiltRate}% tilt (${core.worstStreak}-game streak)` : ""}${
        facecheckDeaths > 100 ? `, ${facecheckDeaths} facecheck deaths` : ""
      }

Example: "Zero control wards in ${core.games} games while having ${core.visionControl}/100 vision DNA? You know what to do, you just don't do it."

Write ONE savage roast:`;
    }

    return `You are a brutal analyst writing a devastating one-liner for a ${core.rank} player.

CRITICAL: Output EXACTLY ONE SENTENCE (max 35 words). Combine MULTIPLE bad stats with numbers.

Stats: ${core.rank}, ${core.winRate}% WR, ${core.highestDeaths} max deaths, ${core.intRate}% int rate${
      core.controlWardsPerGame === 0 ? `, ZERO control wards` : ""
    }${tiltRate > 60 ? `, ${core.tiltRate}% tilt (${core.worstStreak}-streak)` : ""}${
      facecheckDeaths > 100 ? `, ${facecheckDeaths} facecheck deaths` : ""
    }, ${core.survivability}/100 survivability

Example: "With ${core.highestDeaths} deaths in one game, ${core.intRate}% int rate, and ${core.survivability}/100 survivability DNA, you're not feeding—you've franchised a buffet."

Write ONE nuclear roast:`;
  };

  const gen = async () => {
    setError(null);
    setStage("loading");
    try {
      const prompt = buildPrompt(intensity, data);
      const res = await bedrockGenerate({
        prompt,
        stats: {
          WR: data.WinRate,
          KDA: data.KDA,
          rank: data.Rank,
        },
      });

      const cleanedRoast = res.response
        .trim()
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ");

      setRoast(cleanedRoast);
      setStage("roast");
    } catch (e: any) {
      setError(e?.message || "Failed to generate roast");
      setStage("select");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0F1A24] text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.20] pointer-events-none"
        style={{
          backgroundImage:
            "url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Brand_0.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          filter: "grayscale(25%) blur(2px)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,26,36,0.85),rgba(15,26,36,1))]" />

      <section className="relative z-10 min-h-screen w-full flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl">
          {stage === "intro" && (
            <div
              className="w-full bg-[#121A26]/90 backdrop-blur-md border border-[#223043] p-10 md:p-12 animate-[cardPop_280ms_cubic-bezier(.2,.8,.2,1)]"
              style={{
                borderRadius: 20,
                boxShadow:
                  "0 30px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)",
              }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border border-[#C89B3C]/30">
                <div className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full animate-pulse" />
                <span className="text-[#C89B3C] font-semibold text-xs tracking-wider">
                  JUDGMENT PROTOCOL
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
                Are you ready to get{" "}
                <span className="text-[#C89B3C]">roasted</span>?
              </h1>
              <p className="text-[#A0ADB7]">
                Pick a heat level and we'll serve it straight.
              </p>

              <div className="mt-8">
                <button
                  onClick={() => setStage("select")}
                  className="px-6 py-3 font-black uppercase tracking-wider text-[#0F1A24] bg-[#C89B3C] hover:bg-[#D4AA4D] transition-all rounded-[12px]"
                >
                  Choose Intensity
                </button>
              </div>
            </div>
          )}

          {stage === "select" && (
            <div className="space-y-8 animate-[fadeIn_380ms_ease-out]">
              <div className="text-center">
                <h2 className="text-4xl font-black mb-2">Choose Your Pain</h2>
                <p className="text-[#A0ADB7]">
                  How brutal should the truth be?
                </p>
                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.keys(INTENSITIES) as Intensity[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setIntensity(key)}
                    className={`relative p-6 bg-[#131B28] border transition-all ${
                      intensity === key
                        ? "border-[var(--c)]"
                        : "border-[#1E2A38] hover:border-[#2A3A48]"
                    }`}
                    style={{ ["--c" as any]: INTENSITIES[key].color }}
                  >
                    <div className="absolute inset-0 opacity-5">
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${INTENSITIES[key].champion}_0.jpg`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${INTENSITIES[key].champion}.png`}
                          alt={INTENSITIES[key].champion}
                          className="w-full h-full"
                          style={{
                            clipPath:
                              "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
                          }}
                        />
                        <div
                          className="absolute inset-0 border-2"
                          style={{
                            clipPath:
                              "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
                            borderColor: INTENSITIES[key].color,
                          }}
                        />
                      </div>
                      <div
                        className="text-2xl font-black mb-1"
                        style={{ color: INTENSITIES[key].color }}
                      >
                        {INTENSITIES[key].label}
                      </div>
                      <div className="text-sm text-[#A0ADB7]">
                        {INTENSITIES[key].desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStage("intro")}
                  className="px-8 py-3 bg-[#1E2A38] hover:bg-[#2A3A48] text-white font-bold transition-all rounded"
                >
                  Back
                </button>
                <button
                  onClick={gen}
                  className="px-10 py-3 font-black transition-all rounded hover:scale-105"
                  style={{
                    backgroundColor: INTENSITIES[intensity].color,
                    color: "#0F1A24",
                  }}
                >
                  Roast Me
                </button>
              </div>
            </div>
          )}

          {stage === "loading" && (
            <div className="text-center space-y-8 animate-[fadeIn_380ms_ease-out]">
              <div className="relative w-24 h-24 mx-auto">
                <div
                  className="absolute inset-0 border-4 border-t-transparent animate-spin"
                  style={{
                    borderColor: INTENSITIES[intensity].color,
                    clipPath:
                      "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
                  }}
                />
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${INTENSITIES[intensity].champion}.png`}
                  alt=""
                  className="absolute inset-2 w-20 h-20"
                  style={{
                    clipPath:
                      "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
                  }}
                />
              </div>
              <h3
                className="text-3xl font-black"
                style={{ color: INTENSITIES[intensity].color }}
              >
                ANALYZING GAMEPLAY
              </h3>
              <div className="space-y-3 max-w-md mx-auto">
                {[
                  "Reviewing decision making",
                  "Calculating int count",
                  "Measuring skill gap",
                  "Generating roast",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 bg-[#0A1018] border-l-2"
                    style={{
                      borderColor: INTENSITIES[intensity].color,
                      animation: `slideIn 0.4s ease-out ${i * 0.28}s both`,
                    }}
                  >
                    <span className="text-[#A0ADB7] text-sm flex-1 text-left">
                      {step}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: INTENSITIES[intensity].color,
                            animation: `pulse 1s ease-in-out infinite ${j * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === "roast" && (
            <div className="space-y-6 animate-[fadeIn_380ms_ease-out]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${INTENSITIES[intensity].champion}.png`}
                      alt=""
                      className="w-full h-full"
                      style={{
                        clipPath:
                          "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 border-2"
                      style={{
                        clipPath:
                          "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
                        borderColor: INTENSITIES[intensity].color,
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-[#5A6B7A] uppercase tracking-wider">
                      Verdict
                    </div>
                    <div
                      className="text-xl font-black"
                      style={{ color: INTENSITIES[intensity].color }}
                    >
                      {INTENSITIES[intensity].label.toUpperCase()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStage("intro");
                    setRoast("");
                  }}
                  className="text-[#5A6B7A] hover:text-white text-sm"
                >
                  ← Start Over
                </button>
              </div>

              <div
                className="p-8 border-l-4 bg-[#0A1018]"
                style={{ borderColor: INTENSITIES[intensity].color }}
              >
                <p className="text-2xl leading-relaxed">{roast}</p>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <StatCard
                  label="Deaths (max)"
                  value={data.CombatStats.HighestDeathsGame}
                  color="#DC4446"
                />
                <StatCard
                  label="Zero Kill Games"
                  value={data.other_stats.games_with_zero_kills}
                  color="#DC4446"
                />
                <StatCard
                  label="Int Games"
                  value={data.other_stats.games_with_more_deaths_than_kills}
                  color="#DC4446"
                />
                <StatCard
                  label="KDA"
                  value={data.KDA.toFixed(2)}
                  color="#C89B3C"
                />
                <StatCard
                  label="Win Rate"
                  value={`${data.WinRate.toFixed(0)}%`}
                  color={data.WinRate >= 50 ? "#0AC8B9" : "#DC4446"}
                />
              </div>
            </div>
          )}
        </div>

        {onScrollDown && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ScrollButton onClick={onScrollDown} />
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes cardPop {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="p-4 bg-[#131B28] border border-[#1E2A38] rounded-[12px]">
      <div className="text-xs text-[#5A6B7A] uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-2xl font-black" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
