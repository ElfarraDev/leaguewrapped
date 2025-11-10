"use client";

import React, { useState } from "react";
import { WrappedData } from "@/types/wrapped.types";
import { copyText } from "@/utils/safeCopy";

type StatFmt = "percent" | "ratio" | "decimal" | "number";

export default function ComparisonView({
  userData,
  friendData,
  onNewComparison,
}: {
  userData: WrappedData;
  friendData: WrappedData;
  onNewComparison: () => void;
}) {
  const aRegion =
    userData.Region.toUpperCase() === "AMERICAS"
      ? "NA1"
      : userData.Region.toUpperCase();
  const bRegion =
    friendData.Region.toUpperCase() === "AMERICAS"
      ? "NA1"
      : friendData.Region.toUpperCase();

  const bgChampion =
    friendData?.TopChampion?.Name || userData?.TopChampion?.Name || "Ahri";

  const stats: Array<{
    key: string;
    label: string;
    a: number;
    b: number;
    format: StatFmt;
    color: string;
  }> = [
    {
      key: "winrate",
      label: "Win Rate",
      a: userData.WinRate,
      b: friendData.WinRate,
      format: "percent",
      color: "#0AC8B9",
    },
    {
      key: "kda",
      label: "KDA",
      a: userData.KDA,
      b: friendData.KDA,
      format: "ratio",
      color: "#C89B3C",
    },
    {
      key: "kp",
      label: "Kill Participation",
      a: userData.KillParticipation,
      b: friendData.KillParticipation,
      format: "percent",
      color: "#F0B232",
    },
    {
      key: "dpm",
      label: "Damage / Min",
      a: userData.DamagePerMinute,
      b: friendData.DamagePerMinute,
      format: "number",
      color: "#DC4446",
    },
    {
      key: "cspm",
      label: "CS / Min",
      a: userData.Economy.CSPerMinute,
      b: friendData.Economy.CSPerMinute,
      format: "decimal",
      color: "#F0B232",
    },
    {
      key: "vision",
      label: "Vision / Game",
      a: userData.Vision.VisionScore / userData.GamesPlayed,
      b: friendData.Vision.VisionScore / friendData.GamesPlayed,
      format: "decimal",
      color: "#0AC8B9",
    },
    {
      key: "fb",
      label: "First Bloods",
      a: userData.CombatStats.FirstBloods,
      b: friendData.CombatStats.FirstBloods,
      format: "number",
      color: "#DC4446",
    },
    {
      key: "pentas",
      label: "Pentakills",
      a: userData.Multikills.Pentakills,
      b: friendData.Multikills.Pentakills,
      format: "number",
      color: "#C89B3C",
    },
  ];

  const [copied, setCopied] = useState(false);
  const share = async () => {
    const ok = await copyText(window.location.href);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0F1A24] text-white">
      {/* background champion splash */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${bgChampion}_0.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
          filter: "grayscale(25%) blur(2px)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,26,36,0.88),rgba(15,26,36,1))]" />

      {/* content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 xl:grid-cols-[1fr_56px_1fr_260px] gap-8">
        {/* LEFT (YOU) */}
        <ColumnBlock
          title="You"
          name={userData.SummonerName}
          region={`#${aRegion}`}
          champion={userData.TopChampion.Name}
          stats={stats.map((s) => ({ ...s, self: s.a, opp: s.b }))}
          side="left"
          big
        />

        {/* divider */}
        <div className="hidden xl:flex flex-col items-center">
          <div className="w-px flex-1 bg-[#203040]" />
          <div className="my-2 text-[#5A6B7A] text-sm font-bold">VS</div>
          <div className="w-px flex-1 bg-[#203040]" />
        </div>

        {/* RIGHT (FRIEND) */}
        <ColumnBlock
          title="Friend"
          name={friendData.SummonerName}
          region={`#${bRegion}`}
          champion={friendData.TopChampion.Name}
          stats={stats.map((s) => ({ ...s, self: s.b, opp: s.a }))}
          side="right"
          big
        />

        {/* RIGHT UTILITY RAIL */}
        <aside className="sticky self-start top-6 h-min bg-[#121A26]/90 backdrop-blur-md border border-[#223043] p-5 flex flex-col gap-3 rounded-2xl">
          <button
            onClick={share}
            className="w-full px-4 py-3 bg-[#C89B3C] hover:bg-[#D4AA4D] text-[#0F1A24] font-black transition-all rounded-lg"
          >
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={onNewComparison}
            className="w-full px-4 py-3 bg-[#1E2A38] hover:bg-[#2A3A48] text-white font-bold transition-all rounded-lg"
          >
            New Comparison
          </button>
          <div className="mt-2 text-[11px] text-[#8C97A3]">
            Tip: hover a stat to spotlight the leader.
          </div>
        </aside>
      </div>
    </div>
  );
}

function ColumnBlock({
  title,
  name,
  region,
  champion,
  stats,
  side,
  big = false,
}: {
  title: string;
  name: string;
  region: string;
  champion: string;
  side: "left" | "right";
  stats: Array<{
    key: string;
    label: string;
    self: number;
    opp: number;
    format: StatFmt;
    color: string;
  }>;
  big?: boolean;
}) {
  return (
    <div
      className="bg-[#131B28]/90 backdrop-blur-md border border-[#1E2A38] p-6 md:p-8 rounded-2xl relative overflow-hidden"
      style={{
        boxShadow:
          "0 30px 90px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)",
      }}
    >
      {/* subtle top gradient line */}
      <div className="pointer-events-none absolute -top-[1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C89B3C] to-transparent opacity-50" />
      {/* header row */}
      <div
        className={`flex items-center ${side === "left" ? "justify-end" : "justify-start"} gap-6 mb-6`}
      >
        {side === "right" && (
          <SquareAvatar champion={champion} size={big ? 128 : 104} />
        )}
        <div className={`${side === "left" ? "text-right" : "text-left"}`}>
          <div className="text-xs text-[#5A6B7A] uppercase tracking-wider mb-1">
            {title}
          </div>
          <div
            className={`font-black ${big ? "text-3xl md:text-4xl" : "text-2xl"}`}
          >
            {name}
          </div>
          <div
            className={`text-[11px] ${side === "left" ? "text-[#C89B3C]" : "text-[#0AC8B9]"} font-bold`}
          >
            {region}
          </div>
          <div className="text-[11px] text-[#A0ADB7] mt-1">{champion}</div>
        </div>
        {side === "left" && (
          <SquareAvatar champion={champion} size={big ? 128 : 104} />
        )}
      </div>

      {/* improved stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map(({ key, label, self, opp, format, color }) => {
          const leader = self > opp ? "self" : self < opp ? "opp" : "draw";
          return (
            <div
              key={`${side}-${key}`}
              className="group p-4 bg-[#0A1428] border border-[#1E2A38] rounded-xl relative overflow-hidden hover:border-[#2A3A48] transition-all"
            >
              {/* glow accent */}
              <div
                className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(600px circle at var(--x,50%) var(--y,50%), ${color}22, transparent 40%)`,
                }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#A0ADB7]">{label}</span>
                <span
                  className={`text-sm font-bold ${leader === "self" ? "text-white" : "text-[#8C97A3]"}`}
                >
                  {formatValue(self, format)}
                </span>
              </div>

              {/* comparison bar */}
              <div className="relative h-3 bg-[#0E1A2A] border border-[#1E2A38] overflow-hidden rounded">
                {/* self side fill */}
                <div
                  className="absolute left-0 top-0 h-full transition-all"
                  style={{
                    width: `${ratioWidth(self, opp)}%`,
                    background:
                      leader === "self"
                        ? `linear-gradient(90deg, ${color}, ${color}dd)`
                        : `${color}55`,
                    boxShadow:
                      leader === "self" ? `0 0 12px ${color}77` : "none",
                  }}
                />
                {/* thin indicator line for opponent to hint spread */}
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: `${ratioWidth(opp, self)}%`,
                    width: 2,
                    background: "#233243",
                  }}
                />
              </div>

              {/* opponent value under bar */}
              <div className="mt-1 text-[11px] text-[#8C97A3]">
                Opp:{" "}
                <span
                  className={leader === "opp" ? "text-white font-semibold" : ""}
                >
                  {formatValue(opp, format)}
                </span>
                {leader === "draw" && (
                  <span className="ml-1 text-[#A0ADB7]">(Draw)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SquareAvatar({
  champion,
  size = 104,
}: {
  champion: string;
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 blur-2xl opacity-40"
        style={{ background: "#C89B3C33", borderRadius: 24 }}
      />
      <div
        className="relative overflow-hidden bg-[#0F1A24] border border-[#2A3A48] rounded-2xl"
        style={{ width: size, height: size }}
      >
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`}
          alt={champion}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
          style={{ objectPosition: "center 35%" }}
        />
      </div>
    </div>
  );
}

function ratioWidth(primary: number, secondary: number) {
  const denom = Math.max(primary, secondary, 1e-6);
  return (primary / denom) * 100;
}
function formatValue(v: number, f: StatFmt) {
  if (f === "percent") return `${v.toFixed(1)}%`;
  if (f === "ratio") return v.toFixed(2);
  if (f === "decimal") return v.toFixed(1);
  return Math.round(v).toLocaleString();
}
