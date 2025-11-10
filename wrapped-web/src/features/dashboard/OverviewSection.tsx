import React from "react";
import { WrappedData } from "@/types/wrapped.types";

export default function OverviewSection({ data }: { data: WrappedData }) {
  return (
    <div className="space-y-5">
      {/* Time Played */}
      <div>
        <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-3">
          Time Played
        </h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-7xl font-black text-white leading-none">
            {Math.round(data.TimePlayed.Hours)}
          </span>
          <span className="text-2xl font-bold text-[#8A9099]">hrs</span>
        </div>
        <div className="text-[#8A9099] text-xs space-y-0.5">
          <div>{data.TimePlayed.Days.toFixed(1)} days</div>
          <div>{data.TimePlayed.Minutes.toLocaleString()} minutes</div>
        </div>
      </div>

      {/* KDA & Win Rate */}
      <div className="pt-5 border-t border-[#2D3A47]">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-2">
              KDA
            </h3>
            <div className="text-5xl font-black text-[#C89B3C]">
              {data.KDA.toFixed(2)}
            </div>
          </div>
          <div>
            <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-2">
              Win Rate
            </h3>
            <div className="text-5xl font-black text-white">
              {data.WinRate.toFixed(1)}
              <span className="text-2xl">%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]/30">
            <div className="text-2xl font-black text-white">
              {data.KillsPerGame.toFixed(1)}
            </div>
            <div className="text-[#8A9099] text-[10px] uppercase">K/G</div>
          </div>
          <div className="bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]/30">
            <div className="text-2xl font-black text-white">
              {data.DeathsPerGame.toFixed(1)}
            </div>
            <div className="text-[#8A9099] text-[10px] uppercase">D/G</div>
          </div>
          <div className="bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]/30">
            <div className="text-2xl font-black text-white">
              {data.AssistsPerGame.toFixed(1)}
            </div>
            <div className="text-[#8A9099] text-[10px] uppercase">A/G</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between mb-1.5 text-xs">
            <span className="text-[#8A9099]">Kill Participation</span>
            <span className="text-white font-bold">
              {data.KillParticipation.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-[#1A2632] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C89B3C]"
              style={{ width: `${data.KillParticipation}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-[#0AC8B9]">{data.Wins}W</span>
          <span className="text-[#8A9099]">{data.GamesPlayed} Games</span>
          <span className="text-[#DC4446]">{data.Losses}L</span>
        </div>
      </div>

      {/* Multikills */}
      <div className="pt-5 border-t border-[#2D3A47]">
        <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-3">
          Multikills
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#C89B3C]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs text-[#8A9099]">Pentakills</span>
            </div>
            <span className="text-xl font-black text-white">
              {data.Multikills.Pentakills}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#F0B232]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs text-[#8A9099]">Quadrakills</span>
            </div>
            <span className="text-xl font-black text-white">
              {data.Multikills.Quadrakills}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#0AC8B9]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs text-[#8A9099]">Triple Kills</span>
            </div>
            <span className="text-xl font-black text-white">
              {data.Multikills.TripleKills}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
