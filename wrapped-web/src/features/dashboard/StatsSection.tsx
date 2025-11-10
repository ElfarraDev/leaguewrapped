import React from "react";
import { WrappedData } from "@/types/wrapped.types";

export default function StatsSection({ data }: { data: WrappedData }) {
  return (
    <div className="space-y-5">
      {/* Objectives */}
      <div>
        <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-3">
          Objectives
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#DC4446]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              <span className="text-xs text-[#8A9099]">Dragons</span>
            </div>
            <span className="text-lg font-black text-white">
              {data.Objectives.Dragons}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#C89B3C]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              <span className="text-xs text-[#8A9099]">Barons</span>
            </div>
            <span className="text-lg font-black text-white">
              {data.Objectives.Barons}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#0AC8B9]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              <span className="text-xs text-[#8A9099]">Heralds</span>
            </div>
            <span className="text-lg font-black text-white">
              {data.Objectives.Heralds}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#F0B232]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span className="text-xs text-[#8A9099]">Turret Plates</span>
            </div>
            <span className="text-lg font-black text-white">
              {data.Objectives.TurretPlates}
            </span>
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <div>
        <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-3">
          Combat Stats
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]">
            <span className="text-xs text-[#8A9099]">First Bloods</span>
            <span className="text-lg font-black text-[#DC4446]">
              {data.CombatStats.FirstBloods}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]">
            <span className="text-xs text-[#8A9099]">Solo Kills</span>
            <span className="text-lg font-black text-white">
              {data.CombatStats.SoloKills}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#1A2632]/50 p-3 rounded border border-[#2D3A47]">
            <span className="text-xs text-[#8A9099]">Towers Destroyed</span>
            <span className="text-lg font-black text-white">
              {data.CombatStats.TowersDestroyed}
            </span>
          </div>
        </div>
      </div>

      {/* Economy */}
      <div>
        <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-3">
          Economy
        </h3>
        <div className="bg-[#1A2632]/50 p-4 rounded-lg border border-[#2D3A47] space-y-3">
          <div>
            <div className="text-[#8A9099] text-[10px] uppercase mb-1">
              Gold Earned
            </div>
            <div className="text-3xl font-black text-[#C89B3C]">
              {(data.Economy.GoldEarned / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-[#8A9099]">
              {data.Economy.GoldPerMinute.toFixed(0)} g/min
            </div>
          </div>
          <div>
            <div className="text-[#8A9099] text-[10px] uppercase mb-1">
              CS Per Minute
            </div>
            <div className="text-2xl font-black text-white">
              {data.Economy.CSPerMinute.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div>
        <h3 className="text-[#8A9099] text-xs font-medium uppercase tracking-wider mb-3">
          Vision
        </h3>
        <div className="bg-[#1A2632]/50 p-4 rounded-lg border border-[#2D3A47] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A9099]">Vision Score</span>
            <span className="text-2xl font-black text-[#F0B232]">
              {(data.Vision.VisionScore / data.GamesPlayed).toFixed(0)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A9099]">Wards Placed</span>
            <span className="text-white font-semibold">
              {data.Vision.WardsPlaced.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A9099]">Wards Killed</span>
            <span className="text-white font-semibold">
              {data.Vision.WardsKilled}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
