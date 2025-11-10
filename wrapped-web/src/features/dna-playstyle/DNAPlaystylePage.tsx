"use client";

import React, { useEffect, useMemo, useState } from "react";
import { WrappedData } from "@/types/wrapped.types";
import { useDNAPlaystyleAI } from "./useDNAPlaystyleAI";
import DNAStrandVisual from "./DNAStrandVisual";
import ScrollButton from "@/components/navigation/ScrollButton";

export default function DNAPlaystylePage({
  data,
  onScrollDown,
}: {
  data: WrappedData;
  onScrollDown?: () => void;
}) {
  const { ai, loading, error, generate, ready, mostPlayedChampion } =
    useDNAPlaystyleAI(data);

  const [stage, setStage] = useState<"intro" | "processing" | "reveal">(
    "intro",
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = stage === "reveal" ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [stage]);

  const bgChamp = useMemo(
    () =>
      mostPlayedChampion ||
      data?.TopChampion?.Name ||
      data?.BestChampionsByWinRate?.[0]?.Name ||
      "Ahri",
    [mostPlayedChampion, data],
  );

  const archetypeTile = useMemo(
    () =>
      `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${bgChamp}.png`,
    [bgChamp],
  );

  const start = async () => {
    setStage("processing");
    try {
      if (ready) await generate();
    } finally {
      setTimeout(() => setStage("reveal"), 700);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0F1A24] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${bgChamp}_0.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          filter: "grayscale(25%) blur(2px)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,26,36,0.85),rgba(15,26,36,1))]" />

      {stage !== "reveal" && (
        <section className="relative z-10 h-screen w-full flex items-center justify-center px-6">
          <div
            className="w-full max-w-2xl bg-[#121A26]/90 backdrop-blur-md border border-[#223043] p-8 md:p-10 animate-[cardPop_280ms_cubic-bezier(.2,.8,.2,1)]"
            style={{
              borderRadius: 20,
              boxShadow:
                "0 30px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 border border-[#C89B3C]/30">
              <div className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full animate-pulse" />
              <span className="text-[#C89B3C] font-semibold text-xs tracking-wider">
                DNA ANALYSIS
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
              Your <span className="text-[#C89B3C]">playstyle DNA</span>, by AI
            </h1>
            <p className="text-[#A0ADB7]">
              Minimal. Clean. Honest. Generated from your real games.
            </p>

            <div className="mt-8">
              <button
                onClick={start}
                disabled={!ready || loading}
                className="px-6 py-3 font-black uppercase tracking-wider text-[#0F1A24] bg-[#C89B3C] hover:bg-[#D4AA4D] transition-all disabled:opacity-60 rounded-[12px]"
              >
                {loading ? "Analyzing…" : "Reveal my DNA"}
              </button>
            </div>

            {loading && (
              <div className="mt-6 w-full">
                <div className="h-2 bg-[#1E2A38] overflow-hidden rounded">
                  <div className="h-full bg-[#C89B3C] animate-[dnaProgress_1.1s_ease-in-out_infinite]" />
                </div>
                <p className="mt-2 text-xs text-[#A0ADB7]">Analyzing games…</p>
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-400">{String(error)}</p>
            )}
          </div>
        </section>
      )}

      {stage === "reveal" && ai && (
        <section className="relative z-10 w-full px-5 md:px-8 py-5 animate-[fadeIn_380ms_ease-out] min-h-screen">
          <div
            className="mx-auto w-full max-w-7xl flex flex-col gap-4"
            style={{ paddingBottom: "120px" }}
          >
            <div className="bg-[#131B28] border border-[#1E2A38] p-5 md:p-6 rounded-[16px]">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={archetypeTile}
                  alt={bgChamp}
                  className="w-16 h-16 md:w-20 md:h-20 rounded border-2 border-[#C89B3C] object-cover"
                />
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs text-[#5A6B7A] uppercase tracking-wider">
                    Your Archetype
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black leading-tight">
                    {ai.archetype.name}
                  </h2>
                  <p className="text-[#A0ADB7] text-sm md:text-base mt-2 max-w-3xl">
                    {ai.archetype.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[11px] bg-[#0A1428] border border-[#1E2A38] px-2.5 py-1 rounded">
                  Primary: <span className="font-bold">{ai.primary}</span>
                </span>
                <span className="text-[11px] bg-[#0A1428] border border-[#1E2A38] px-2.5 py-1 rounded">
                  Secondary: <span className="font-bold">{ai.secondary}</span>
                </span>
                {ai.suggestedChampion && (
                  <span className="text-[11px] bg-[#0A1428] border border-[#1E2A38] px-2.5 py-1 rounded">
                    Suggested pick:{" "}
                    <span className="font-bold">{ai.suggestedChampion}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#131B28] border border-[#1E2A38] px-4 md:px-6 pt-3 pb-4 rounded-[16px]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] md:text-xs text-[#5A6B7A] uppercase tracking-wider">
                    DNA Helix
                  </div>
                  <h3 className="text-xl md:text-2xl font-black">
                    Your Tendencies, Visualized
                  </h3>
                </div>
                <div className="hidden md:flex gap-3 text-[11px] text-[#A0ADB7]">
                  {ai.traits.slice(0, 6).map((t) => (
                    <span key={t.name} className="whitespace-nowrap">
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full" style={{ height: "320px" }}>
                <DNAStrandVisual traits={ai.traits} height={320} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ai.traits.slice(0, 6).map((t) => (
                <div
                  key={t.name}
                  className="bg-[#131B28] border border-[#1E2A38] p-4 rounded-[14px] flex flex-col justify-between"
                  style={{ minHeight: 110 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold truncate">{t.name}</span>
                    <span className="text-[11px] text-[#A0ADB7]">
                      {t.value}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-[#0A1428] border border-[#1E2A38] overflow-hidden rounded">
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-700"
                      style={{
                        width: `${t.value}%`,
                        background: `linear-gradient(90deg, ${t.color}00, ${t.color})`,
                        boxShadow: `0 0 8px ${t.color}80`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-[#7e91a6] line-clamp-2">
                    {t.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#131B28] border border-[#1E2A38] px-5 py-4 rounded-[12px]">
              <div className="text-[#C89B3C] text-sm font-bold mb-1">
                Insight
              </div>
              <p className="text-[#A0ADB7] text-sm leading-relaxed">
                {ai.insight}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SCROLL BUTTON - Shows on BOTH intro and reveal screens */}
      {onScrollDown && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
          <ScrollButton onClick={onScrollDown} />
        </div>
      )}

      <style jsx>{`
        @keyframes dnaProgress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(-45%);
          }
          100% {
            transform: translateX(0%);
          }
        }
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
      `}</style>
    </div>
  );
}
