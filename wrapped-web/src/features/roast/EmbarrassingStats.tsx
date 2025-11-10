"use client";

import { WrappedData } from "@/types/wrapped.types";

interface EmbarrassingStatsProps {
  data: WrappedData;
}

export default function EmbarrassingStats({ data }: EmbarrassingStatsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[#C89B3C] text-sm uppercase tracking-widest mb-4">
          Your Most Embarrassing Stats
        </h3>

        <div className="space-y-3">
          <div className="bg-[#0A1018] p-4 rounded border border-[#5A6B7A]/20">
            <div className="text-[#5A6B7A] text-xs mb-1">
              Games With More Deaths Than Kills
            </div>
            <div className="text-4xl font-black text-white mb-1">
              {data.other_stats.games_with_more_deaths_than_kills}
            </div>
            <div className="text-[#5A6B7A] text-xs">
              That's{" "}
              {(
                (data.other_stats.games_with_more_deaths_than_kills /
                  data.GamesPlayed) *
                100
              ).toFixed(0)}
              % of your games
            </div>
          </div>

          <div className="bg-[#0A1018] p-4 rounded border border-[#5A6B7A]/20">
            <div className="text-[#5A6B7A] text-xs mb-1">
              Games With Zero Kills
            </div>
            <div className="text-4xl font-black text-white mb-1">
              {data.other_stats.games_with_zero_kills}
            </div>
            <div className="text-[#5A6B7A] text-xs">Complete shutout</div>
          </div>

          <div className="bg-[#0A1018] p-4 rounded border border-[#5A6B7A]/20">
            <div className="text-[#5A6B7A] text-xs mb-1">
              Most Deaths on Team
            </div>
            <div className="text-4xl font-black text-white mb-1">
              {data.other_stats.games_with_most_deaths_on_team}
            </div>
            <div className="text-[#5A6B7A] text-xs">Team MVP (for dying)</div>
          </div>

          <div className="bg-[#0A1018] p-4 rounded border border-[#5A6B7A]/20">
            <div className="text-[#5A6B7A] text-xs mb-1">
              Most Deaths in Entire Game
            </div>
            <div className="text-4xl font-black text-white mb-1">
              {data.other_stats.games_with_most_deaths_in_game}
            </div>
            <div className="text-[#5A6B7A] text-xs">Both teams combined</div>
          </div>

          <div className="bg-[#0A1018] p-4 rounded border border-[#5A6B7A]/20">
            <div className="text-[#5A6B7A] text-xs mb-1">
              Highest Deaths in a Game
            </div>
            <div className="text-4xl font-black text-white mb-1">
              {data.CombatStats.HighestDeathsGame}
            </div>
            <div className="text-[#5A6B7A] text-xs">Personal worst</div>
          </div>
        </div>
      </div>

      {/* Worst Performance */}
      <div className="bg-[#0A1018] p-4 rounded border border-[#5A6B7A]/30">
        <div className="text-[#C89B3C] text-xs uppercase tracking-widest mb-3">
          Worst Performance
        </div>
        <div className="flex items-center gap-4">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${data.PerformanceHighlights.WorstPerformance.champion}.png`}
            alt={data.PerformanceHighlights.WorstPerformance.champion}
            className="w-16 h-16 rounded"
          />
          <div className="flex-1">
            <div className="text-white text-lg font-bold mb-1">
              {data.PerformanceHighlights.WorstPerformance.champion}
            </div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-white text-2xl font-black">
                  {data.PerformanceHighlights.WorstPerformance.kda}
                </div>
                <div className="text-[#5A6B7A] text-xs">K/D/A</div>
              </div>
              <div>
                <div className="text-white text-xl font-bold">
                  {(
                    data.PerformanceHighlights.WorstPerformance.damage_dealt /
                    1000
                  ).toFixed(1)}
                  k
                </div>
                <div className="text-[#5A6B7A] text-xs">Damage</div>
              </div>
              <div>
                <div className="text-white text-xl font-bold">
                  {data.PerformanceHighlights.WorstPerformance.game_duration_minutes.toFixed(
                    0,
                  )}
                  m
                </div>
                <div className="text-[#5A6B7A] text-xs">Duration</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
