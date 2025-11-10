"use client";

import { WrappedData } from "@/types/wrapped.types";

interface HeroStatsProps {
  data: WrappedData;
}

export default function HeroStats({ data }: HeroStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Hours Played */}
      <div>
        <div className="text-[#5A6B7A] text-xs uppercase tracking-widest mb-2">
          Hours Played
        </div>
        <div className="text-7xl font-black text-[#C89B3C] leading-none mb-2">
          {Math.round(data.TimePlayed.Hours)}
        </div>
        <div className="text-[#5A6B7A] text-sm space-y-0.5">
          <div>{data.TimePlayed.Days.toFixed(0)} days</div>
          <div>{data.TimePlayed.Minutes.toLocaleString()} minutes</div>
          <div>{data.TimePlayed.Seconds.toLocaleString()} seconds</div>
        </div>
      </div>

      {/* Total Damage */}
      <div>
        <div className="text-[#5A6B7A] text-xs uppercase tracking-widest mb-2">
          Total Damage
        </div>
        <div className="text-7xl font-black text-[#DC4446] leading-none mb-2">
          {(data.other_stats.DamageDealt / 1000000).toFixed(1)}M
        </div>
        <div className="text-[#5A6B7A] text-sm space-y-0.5">
          <div>{data.DamagePerMinute.toFixed(0)} per minute</div>
          <div>Avg: {(data.Economy.AverageDamageDealt / 1000).toFixed(1)}k</div>
        </div>
      </div>

      {/* Total Gold */}
      <div>
        <div className="text-[#5A6B7A] text-xs uppercase tracking-widest mb-2">
          Total Gold
        </div>
        <div className="text-7xl font-black text-[#F0B232] leading-none mb-2">
          {(data.Economy.GoldEarned / 1000000).toFixed(1)}M
        </div>
        <div className="text-[#5A6B7A] text-sm space-y-0.5">
          <div>{data.Economy.CSPerMinute.toFixed(1)} CS/min</div>
          <div>{data.Economy.GoldPerMinute.toFixed(0)} gold/min</div>
        </div>
      </div>

      {/* Total Matches */}
      <div>
        <div className="text-[#5A6B7A] text-xs uppercase tracking-widest mb-2">
          Total Matches
        </div>
        <div className="text-7xl font-black text-white leading-none mb-2">
          {data.GamesPlayed}
        </div>
        <div className="text-[#5A6B7A] text-sm space-y-0.5">
          <div className="flex gap-2">
            <span className="text-[#0AC8B9]">{data.Wins}W</span>
            <span className="text-[#DC4446]">{data.Losses}L</span>
          </div>
          <div>{data.WinRate.toFixed(1)}% win rate</div>
        </div>
      </div>
    </div>
  );
}
