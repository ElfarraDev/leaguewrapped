"use client";

import { WrappedData } from "@/types/wrapped.types";
import {
  KDATrendChart,
  MonthlyActivityChart,
  PerformanceRadar,
} from "@/components/charts";

interface StatsGridProps {
  data: WrappedData;
}

export default function StatsGrid({ data }: StatsGridProps) {
  // Calculate performance metrics (normalize to 0-100 scale)
  const performanceMetrics = {
    mechanics: Math.min(100, (data.KDA / 5) * 100),
    farm: Math.min(100, (data.Economy.CSPerMinute / 10) * 100),
    objective: Math.min(100, (data.Objectives.Dragons / 500) * 100),
    teamwork: Math.min(100, (data.KillParticipation / 100) * 100),
    vision: Math.min(
      100,
      (data.Vision.VisionScore / data.GamesPlayed / 30) * 100,
    ),
  };

  return (
    <div className="space-y-6">
      {/* KDA & Performance */}
      <div className="grid grid-cols-2 gap-6">
        {/* KDA Stats */}
        <div>
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
            Overall KDA
          </div>
          <div className="text-6xl font-black text-[#C89B3C] leading-none mb-4">
            {data.KDA.toFixed(2)}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-[#5A6B7A] text-xs mb-1">K</div>
              <div className="text-3xl font-black text-white">
                {data.KillsPerGame.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#5A6B7A] text-xs mb-1">D</div>
              <div className="text-3xl font-black text-white">
                {data.DeathsPerGame.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#5A6B7A] text-xs mb-1">A</div>
              <div className="text-3xl font-black text-white">
                {data.AssistsPerGame.toFixed(1)}
              </div>
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5A6B7A]">Total Kills</span>
              <span className="text-white font-bold">
                {data.KeyInsights.TotalKills.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6B7A]">Total Assists</span>
              <span className="text-white font-bold">
                {data.KeyInsights.TotalAssists.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6B7A]">Kill Participation</span>
              <span className="text-white font-bold">
                {data.KillParticipation.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div>
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
            Win Rate
          </div>
          <div className="text-6xl font-black text-white leading-none mb-4">
            {data.WinRate.toFixed(0)}%
          </div>
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-4xl font-black text-[#0AC8B9]">
                {data.Wins}
              </div>
              <div className="text-[#5A6B7A] text-xs">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-[#DC4446]">
                {data.Losses}
              </div>
              <div className="text-[#5A6B7A] text-xs">Losses</div>
            </div>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5A6B7A]">Win Streak</span>
              <span className="text-[#0AC8B9] font-bold">
                {data.other_stats.LongestWinStreak}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6B7A]">Total Games</span>
              <span className="text-white font-bold">{data.GamesPlayed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KDA Trend */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-[#5A6B7A] text-xs uppercase tracking-wider">
            KDA Trend
          </span>
          <span className="text-[#C89B3C] text-xl font-black">
            {data.KDA.toFixed(2)}
          </span>
        </div>
        <KDATrendChart kda={data.KDA} />
      </div>

      {/* Monthly Activity */}
      <div>
        <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
          Monthly Activity
        </div>
        <MonthlyActivityChart data={data.MonthlyActivity} />
      </div>

      {/* Multikills & Combat */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
            Multikills
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Pentakills</span>
              <span className="text-4xl font-black text-[#C89B3C]">
                {data.Multikills.Pentakills}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Quadrakills</span>
              <span className="text-3xl font-black text-[#F0B232]">
                {data.Multikills.Quadrakills}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Triple Kills</span>
              <span className="text-3xl font-black text-white">
                {data.Multikills.TripleKills}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Double Kills</span>
              <span className="text-2xl font-black text-white">
                {data.other_stats.doubleKills}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
            Combat
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">First Bloods</span>
              <span className="text-4xl font-black text-[#DC4446]">
                {data.CombatStats.FirstBloods}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Solo Kills</span>
              <span className="text-3xl font-black text-white">
                {data.CombatStats.SoloKills}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Towers</span>
              <span className="text-3xl font-black text-white">
                {data.CombatStats.TowersDestroyed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Killstreaks Ended</span>
              <span className="text-2xl font-black text-white">
                {data.other_stats.killstreaks_ended}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Objectives & Vision */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
            Objectives
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Dragons</span>
              <span className="text-4xl font-black text-[#DC4446]">
                {data.Objectives.Dragons}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Barons</span>
              <span className="text-3xl font-black text-[#C89B3C]">
                {data.Objectives.Barons}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Heralds</span>
              <span className="text-3xl font-black text-[#0AC8B9]">
                {data.Objectives.Heralds}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Elder Dragons</span>
              <span className="text-2xl font-black text-[#C89B3C]">
                {data.other_stats.elder_dragons}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
            Vision
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Score/Game</span>
              <span className="text-4xl font-black text-[#F0B232]">
                {(data.Vision.VisionScore / data.GamesPlayed).toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Wards Placed</span>
              <span className="text-3xl font-black text-white">
                {(data.Vision.WardsPlaced / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Wards Killed</span>
              <span className="text-3xl font-black text-white">
                {data.Vision.WardsKilled}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Radar */}
      <div>
        <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
          Performance Profile
        </div>
        <div className="flex justify-center">
          <PerformanceRadar {...performanceMetrics} />
        </div>
      </div>

      {/* Additional Stats */}
      <div>
        <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-3">
          Highlights
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-[#5A6B7A]">Highest Kills (Game)</span>
            <span className="text-white font-bold">
              {data.CombatStats.HighestKillsGame}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A6B7A]">Highest Damage (Game)</span>
            <span className="text-white font-bold">
              {(data.KeyInsights.HighestDamageGame / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A6B7A]">Bounty Collected</span>
            <span className="text-white font-bold">
              {(data.other_stats.bounty_collected / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A6B7A]">Inhibitors Destroyed</span>
            <span className="text-white font-bold">
              {data.other_stats.inhibitors}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A6B7A]">Turret Plates</span>
            <span className="text-white font-bold">
              {data.Objectives.TurretPlates}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
