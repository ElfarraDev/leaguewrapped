"use client";

import React from "react";
import { Scenario } from "./useParallelScenarios";

interface ScenarioCardProps {
  scenario: Scenario;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  ai?: {
    loading: boolean;
    error?: string;
    insight?: string;
    refresh: () => void;
  };
}

export default function ScenarioCard({
  scenario,
  isHovered,
  onHoverChange,
  ai,
}: ScenarioCardProps) {
  return (
    <div
      className="relative"
      style={{ perspective: "1500px" }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div
        className={`bg-[#0F1A24] border-2 transition-all duration-500 ease-out overflow-hidden ${
          isHovered ? "border-[#C89B3C]" : "border-[#1E2A38]"
        }`}
        style={{
          transform: isHovered
            ? "translateY(-10px) scale(1.02)"
            : "translateY(0px) scale(1)",
          transformStyle: "preserve-3d",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {scenario.championImage && (
          <div className="absolute inset-0 opacity-10">
            <img
              src={scenario.championImage}
              alt=""
              className="w-full h-full object-cover object-top"
              style={{
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.5s ease-out",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, #0F1A24 70%)",
              }}
            />
          </div>
        )}

        <div className="relative z-10">
          <div className="p-8 border-b border-[#1E2A38]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-3xl font-black text-white">
                    {scenario.title}
                  </h3>
                  <p className="text-[#A0ADB7] text-sm mt-1">
                    {scenario.description}
                  </p>
                </div>
              </div>
              {scenario.championName && (
                <div className="px-4 py-2 bg-[#0F1A24] border border-[#2A3A48]">
                  <span className="text-[#C89B3C] text-sm font-bold">
                    {scenario.championName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenario.stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-[#0A1018] border transition-all duration-300 p-6 ${
                    stat.highlight
                      ? "border-[#C89B3C]"
                      : "border-[#1E2A38] hover:border-[#C89B3C]/50"
                  }`}
                  style={{
                    transform: isHovered
                      ? `translateY(-${index * 2}px)`
                      : "translateY(0)",
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-4">
                    {stat.label}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[#5A6B7A] text-sm">Current</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">
                          {stat.current}
                        </span>
                        {!stat.isText && (
                          <span className="text-sm text-[#5A6B7A]">
                            {stat.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-6 h-[1px] bg-[#2A3A48]" />
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-[#C89B3C] text-sm font-medium">
                        Alternative
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#C89B3C]">
                          {stat.alternative}
                        </span>
                        {!stat.isText && (
                          <span className="text-sm text-[#C89B3C]">
                            {stat.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    {!stat.isText && (
                      <div
                        className={`flex items-center justify-center gap-2 text-xs pt-2 border-t border-[#1E2A38] ${
                          stat.change > 0
                            ? "text-[#0AC8B9]"
                            : stat.change < 0
                              ? "text-[#DC4446]"
                              : "text-[#5A6B7A]"
                        }`}
                      >
                        <span className="font-bold">
                          {stat.change > 0 ? "▲" : stat.change < 0 ? "▼" : "—"}
                        </span>
                        <span className="font-bold">
                          {Math.abs(stat.change).toFixed(1)}
                          {stat.unit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Minimal AI insight block (no icons) */}
            <div className="mt-8 p-6 bg-[#0A1018] border border-[#2A3A48] rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="text-[#C89B3C] text-sm font-bold">
                    AI Insight
                  </div>
                  <p className="text-[#A0ADB7] text-sm leading-relaxed">
                    {ai?.loading ? (
                      <span className="inline-block w-5/6 h-[1em] bg-[#13202B] animate-pulse rounded" />
                    ) : ai?.error ? (
                      <span className="text-red-400">{ai.error}</span>
                    ) : (
                      ai?.insight || scenario.insight
                    )}
                  </p>
                </div>

                <button
                  onClick={ai?.refresh}
                  disabled={ai?.loading}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-all border
                    ${
                      ai?.loading
                        ? "bg-[#13202B] border-[#243240] text-[#7E8B96] cursor-not-allowed"
                        : "bg-[#131B28] border-[#2A3A48] text-white hover:border-[#C89B3C]"
                    }`}
                  aria-disabled={ai?.loading ? "true" : "false"}
                >
                  {ai?.loading ? "Generating…" : "Generate another insight"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
