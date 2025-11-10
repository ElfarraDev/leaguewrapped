"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { WrappedData } from "@/types/wrapped.types";
import { PerformanceRadar } from "@/components/charts";
import RoastPage from "../roast/RoastPage";
import FriendComparisonPage from "../comparison/FriendComparisonPage";
import ParallelUniversePage from "../parallel-universe/ParallelUniversePage";
import DNAPlaystylePage from "../dna-playstyle/DNAPlaystylePage";
import ScrollButton from "@/components/navigation/ScrollButton";
import { SharePage } from "../share";
import { useWrappedStore } from "@/store/useWrappedStore";

export default function DashboardView({ data }: { data: WrappedData }) {
  // Store the data for CoachBot and others
  const setWrappedData = useWrappedStore((s) => s.setData);
  useEffect(() => {
    setWrappedData?.(data);
  }, [data, setWrappedData]);

  const [showCopied, setShowCopied] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const championShowcaseRef = useRef<HTMLDivElement>(null);

  const topChampions = data.BestChampionsByWinRate.slice(0, 5);
  const currentChamp = topChampions[selectedChampion];

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {}
  };

  const sections = () =>
    Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>(".wrapped-section") ??
        [],
    );

  const scrollToPage = (idx: number) => {
    const s = sections();
    s[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToNext = () =>
    scrollToPage(Math.min(currentPage + 1, sections().length - 1));

  const onScroll = () => {
    const c = containerRef.current;
    if (!c) return;
    const s = sections();
    const distances = s.map((el) => Math.abs(el.offsetTop - c.scrollTop));
    const page = distances.indexOf(Math.min(...distances));
    setCurrentPage(page);
  };

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const s = sections();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("section-in"),
        ),
      { root: c, threshold: 0.35 },
    );
    s.forEach((sec) => {
      sec.classList.add("section-anim");
      io.observe(sec);
    });
    return () => io.disconnect();
  }, []);

  const regionDisplay =
    data.Region.toUpperCase() === "AMERICAS"
      ? "NA1"
      : data.Region.toUpperCase();

  const totalSeconds =
    data.other_stats?.time_played?.seconds ?? data.TimePlayed.Seconds;
  const timeDeadPct =
    totalSeconds > 0
      ? (data.CombatStats.TotalTimeSpentDead / totalSeconds) * 100
      : 0;

  // Distinct background champ for dashboard
  const dashboardBgChamp = useMemo(() => {
    const top =
      data?.TopChampion?.Name || data?.BestChampionsByWinRate?.[0]?.Name;
    const second = data?.BestChampionsByWinRate?.[1]?.Name;
    if (second && second !== top) return second;
    return top === "Jinx" ? "Braum" : "Jinx";
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ===== Page 1 — Dashboard ===== */}
      <div className="wrapped-section relative h-screen bg-[#0F1A24] text-white snap-start flex flex-col">
        {/* UNIQUE background image */}
        <div
          className="absolute inset-0 opacity-[0.16] pointer-events-none"
          style={{
            backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${dashboardBgChamp}_0.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
            filter: "grayscale(25%) blur(1.5px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A24]/65 via-transparent to-[#0F1A24]" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[#1E2A38] relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6">
                <svg viewBox="0 0 24 24" fill="#C89B3C">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black">#LOLWrapped</h1>
            </div>
            <p className="text-[#5A6B7A] text-xs ml-8">
              My 2025 League of Legends Wrapped
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#1E2A38] px-4 py-2 rounded flex items-center gap-2">
              <span className="text-white font-black text-base">
                {data.SummonerName}
              </span>
              <span className="text-[#C89B3C] text-sm font-bold">
                #{regionDisplay}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="px-5 py-2 bg-[#C89B3C] hover:bg-[#D4AA4D] text-[#0F1A24] font-black text-sm transition-all relative"
            >
              {showCopied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-5 gap-6 px-8 py-5 border-b border-[#1E2A38] relative z-10">
          <TopStat
            label="Hours Played"
            valueMain={Math.round(data.TimePlayed.Hours)}
            sub={[
              `${data.TimePlayed.Days.toFixed(0)} days`,
              `${data.TimePlayed.Minutes.toLocaleString()} minutes`,
              `${data.TimePlayed.Seconds.toLocaleString()} seconds`,
            ]}
            color="#C89B3C"
          />
          <TopStat
            label="Total Damage"
            valueMain={
              (data.other_stats.DamageDealt / 1_000_000).toFixed(1) + "M"
            }
            sub={[
              `${data.DamagePerMinute.toFixed(0)} per minute`,
              `Avg: ${(data.Economy.AverageDamageDealt / 1000).toFixed(1)}k`,
            ]}
            color="#DC4446"
          />
          <TopStat
            label="Total Gold"
            valueMain={(data.Economy.GoldEarned / 1_000_000).toFixed(1) + "M"}
            sub={[
              `${data.Economy.CSPerMinute.toFixed(1)} CS/min`,
              `${data.Economy.GoldPerMinute.toFixed(0)} gold/min`,
            ]}
            color="#F0B232"
          />
          <TopStat
            label="Total Matches"
            valueMain={String(data.GamesPlayed)}
            sub={[
              `${data.Wins}W • ${data.Losses}L`,
              `${data.WinRate.toFixed(1)}% win rate`,
            ]}
            color="#ffffff"
          />
          <TopStat
            label="Total Kills"
            valueMain={(data.KeyInsights.TotalKills / 1000).toFixed(1) + "k"}
            sub={[
              `KP: ${data.KillParticipation.toFixed(1)}%`,
              `${(data.KeyInsights.TotalAssists / 1000).toFixed(1)}k assists`,
            ]}
            color="#ffffff"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-6 px-8 py-5 overflow-hidden relative z-10">
          {/* Left */}
          <div className="col-span-3 space-y-4">
            <div className="space-y-3">
              <KDABlock data={data} />
              <WinRateBlock winRate={data.WinRate} />
            </div>

            <div className="pt-3 border-t border-[#1E2A38]">
              <SectionTitle>Multikills</SectionTitle>
              <div className="space-y-1.5">
                <MultiRow
                  label="Pentakills"
                  value={data.Multikills.Pentakills}
                  accent="#C89B3C"
                />
                <MultiRow
                  label="Quadrakills"
                  value={data.Multikills.Quadrakills}
                />
                <MultiRow
                  label="Triple Kills"
                  value={data.Multikills.TripleKills}
                />
                <MultiRow
                  label="Double Kills"
                  value={data.other_stats.doubleKills}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2A38]">
              <SectionTitle>Combat Stats</SectionTitle>
              <div className="space-y-1.5">
                <Row
                  label="First Bloods"
                  value={data.CombatStats.FirstBloods}
                  accent="#DC4446"
                />
                <Row label="Solo Kills" value={data.CombatStats.SoloKills} />
                <Row label="Towers" value={data.CombatStats.TowersDestroyed} />
                <Row
                  label="Killstreaks Ended"
                  value={data.other_stats.killstreaks_ended}
                  small
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2A38]">
              <SectionTitle>Vision</SectionTitle>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white">Vision Score</span>
                  <span className="text-xl font-black text-[#F0B232]">
                    {(data.Vision.VisionScore / data.GamesPlayed).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A6B7A]">Wards Placed</span>
                  <span className="text-white font-bold">
                    {data.Vision.WardsPlaced.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A6B7A]">Wards Killed</span>
                  <span className="text-white font-bold">
                    {data.Vision.WardsKilled}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="col-span-5 flex flex-col gap-4">
            <div
              ref={championShowcaseRef}
              className="relative h-[340px] overflow-hidden"
            >
              <div className="absolute top-3 right-3 px-3 py-1 bg-[#C89B3C] z-10">
                <span className="text-[#0F1A24] text-xs font-black uppercase tracking-wider">
                  Top Champion
                </span>
              </div>

              <img
                key={selectedChampion}
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChamp.Name}_0.jpg`}
                alt={currentChamp.Name}
                className="w-full h-full object-cover object-[center_20%]"
                style={{ transition: "opacity .4s ease", opacity: 1 }}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1A24] via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0F1A24]/30" />

              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-5xl font-black text-white leading-none mb-2">
                  {currentChamp.Name.toUpperCase()}
                </h2>
                <div className="text-[#C89B3C] text-xs font-medium mb-1">
                  the Doctor of Zaun
                </div>
                <div className="text-[#5A6B7A] text-xs mb-4">
                  {currentChamp.MasteryPoints.toLocaleString()} Mastery Points
                </div>

                <div className="flex gap-4">
                  <BadgeBlock
                    border="#C89B3C"
                    value={currentChamp.KDA.toFixed(1)}
                    label="K/D"
                    valueColor="#C89B3C"
                  />
                  <BadgeBlock
                    border="#0AC8B9"
                    value={`${currentChamp.WinRate.toFixed(1)}%`}
                    label="WR"
                  />
                  <BadgeBlock
                    border="#ffffff"
                    value={String(currentChamp.GamesPlayed)}
                    label="Games"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-2">
                Champion Pool
              </div>
              <div className="grid grid-cols-5 gap-2">
                {topChampions.map((champ, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedChampion(i)}
                    className={`relative overflow-hidden rounded-sm transition-all ${selectedChampion === i ? "ring-2 ring-[#C89B3C]" : "opacity-70 hover:opacity-100"}`}
                    style={{ height: "100%", isolation: "isolate" }}
                  >
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.Name}_0.jpg`}
                      alt={champ.Name}
                      className="w-full aspect-square object-cover object-top"
                      style={{ transform: "scale(1.08)" }}
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0F1A24]/50 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0F1A24]/70 via-[#0F1A24]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5">
                      <div className="text-white text-[10px] font-bold truncate drop-shadow-[0_1px_2px_rgba(0,0,0,.6)]">
                        {champ.Name}
                      </div>
                      <div className="text-[#cbd5e1] text-[9px] drop-shadow-[0_1px_2px_rgba(0,0,0,.6)]">
                        {champ.GamesPlayed}g • {champ.WinRate.toFixed(0)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-4 space-y-4">
            <div className="bg-[#0A1018] p-4">
              <SectionTitle muted>Performance Profile</SectionTitle>
              <div className="flex justify-center">
                <PerformanceRadar
                  mechanics={performanceMetrics.mechanics}
                  farm={performanceMetrics.farm}
                  objective={performanceMetrics.objective}
                  teamwork={performanceMetrics.teamwork}
                  vision={performanceMetrics.vision}
                  size={180}
                />
              </div>
            </div>

            <div>
              <SectionTitle muted>Objectives</SectionTitle>
              <div className="space-y-1.5">
                <ObjRow
                  color="#DC4446"
                  label="Dragons"
                  value={data.Objectives.Dragons}
                />
                <ObjRow
                  color="#C89B3C"
                  label="Barons"
                  value={data.Objectives.Barons}
                />
                <ObjRow
                  color="#0AC8B9"
                  label="Heralds"
                  value={data.Objectives.Heralds}
                />
                <ObjRow
                  color="#F0B232"
                  label="Turret Plates"
                  value={data.Objectives.TurretPlates}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                {"LongestWinStreak" in data.other_stats && (
                  <MiniCard
                    label="Longest Win Streak"
                    value={String(data.other_stats.LongestWinStreak)}
                  />
                )}
                {"inhibitors" in data.other_stats && (
                  <MiniCard
                    label="Inhibitors"
                    value={String(data.other_stats.inhibitors)}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <ChartCard title="Economy Efficiency">
                  <EconomyBars
                    gpm={data.Economy.GoldPerMinute}
                    cs={data.Economy.CSPerMinute}
                  />
                </ChartCard>
                <ChartCard title="Time Spent Dead">
                  <TimeDeadRing
                    percent={timeDeadPct}
                    deadSeconds={data.CombatStats.TotalTimeSpentDead}
                    totalSeconds={totalSeconds}
                  />
                </ChartCard>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .section-anim { opacity: 0; transform: translateY(18px); transition: opacity .35s ease, transform .35s ease; }
          .section-in { opacity: 1; transform: translateY(0); }
        `}</style>

        {/* Bottom-center scroll ONLY here (page 1) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <ScrollButton onClick={scrollToNext} />
        </div>
      </div>

      {/* ===== Page 2 — DNA ===== */}
      <div className="wrapped-section relative snap-start min-h-screen bg-[#0F1A24]">
        <DNAPlaystylePage data={data} onScrollDown={() => scrollToPage(2)} />
      </div>

      {/* ===== Page 3 — Roast ===== */}
      <div className="wrapped-section relative snap-start min-h-screen bg-[#0F1A24]">
        <RoastPage data={data} onScrollDown={() => scrollToPage(3)} />
      </div>

      {/* ===== Page 4 — Friend Comparison ===== */}
      <div className="wrapped-section relative snap-start min-h-screen bg-[#0F1A24]">
        <FriendComparisonPage
          userData={data}
          onScrollDown={() => scrollToPage(4)}
        />
      </div>

      {/* ===== Page 5 — Parallel Universe ===== */}
      <div className="wrapped-section relative snap-start min-h-screen bg-[#0F1A24]">
        <ParallelUniversePage
          data={data}
          onScrollDown={() => scrollToPage(5)}
        />
      </div>

      {/* ===== Page 6 — Share ===== */}
      <div className="wrapped-section snap-start">
        <SharePage data={data} />
      </div>
    </div>
  );
}

/* ===== Small UI bits ===== */
function TopStat({
  label,
  valueMain,
  sub,
  color,
}: {
  label: string;
  valueMain: string | number;
  sub: string[];
  color: string;
}) {
  return (
    <div>
      <div className="text-[#5A6B7A] text-xs uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="text-6xl font-black leading-none mb-1" style={{ color }}>
        {valueMain}
      </div>
      <div className="text-xs text-[#5A6B7A] space-y-0.5">
        {sub.map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
    </div>
  );
}
function KDABlock({ data }: { data: WrappedData }) {
  return (
    <div>
      <div className="text-[#5A6B7A] text-xs uppercase tracking-widest mb-1">
        KDA
      </div>
      <div className="flex items-end gap-3 mb-2">
        <div className="text-6xl font-black text-[#C89B3C] leading-none">
          {data.KDA.toFixed(2)}
        </div>
        <div className="flex gap-2 pb-1">
          <MiniKDANumber v={data.KillsPerGame.toFixed(1)} label="K" />
          <MiniKDANumber v={data.DeathsPerGame.toFixed(1)} label="D" />
          <MiniKDANumber v={data.AssistsPerGame.toFixed(1)} label="A" />
        </div>
      </div>
    </div>
  );
}
function MiniKDANumber({ v, label }: { v: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-black text-white leading-none">{v}</div>
      <div className="text-[9px] text-[#5A6B7A]">{label}</div>
    </div>
  );
}
function WinRateBlock({ winRate }: { winRate: number }) {
  return (
    <div>
      <div className="text-[#5A6B7A] text-xs uppercase tracking-widest mb-1">
        Win Rate
      </div>
      <div className="text-5xl font-black text-white leading-none">
        {winRate.toFixed(1)}%
      </div>
    </div>
  );
}
function SectionTitle({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      className={`${muted ? "text-[#5A6B7A]" : "text-white"} text-xs uppercase tracking-wider mb-2`}
    >
      {children}
    </div>
  );
}
function MultiRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          className="w-3 h-3"
          style={{ color: accent ?? "#0AC8B9" }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-white text-xs">{label}</span>
      </div>
      <span
        className={`text-2xl font-black ${accent ? "text-[#C89B3C]" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}
function Row({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: number | string;
  accent?: string;
  small?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white text-xs">{label}</span>
      <span
        className={`${small ? "text-xl" : "text-2xl"} font-black`}
        style={{ color: accent ?? "#ffffff" }}
      >
        {value}
      </span>
    </div>
  );
}
function ObjRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-white text-sm flex-1">{label}</span>
      <span className="text-2xl font-black text-white">{value}</span>
    </div>
  );
}
function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0A1018] p-3 border border-[#1E2A38]">
      <div className="text-[#5A6B7A] text-[10px] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-white text-xl font-black">{value}</div>
    </div>
  );
}
function BadgeBlock({
  border,
  value,
  label,
  valueColor,
}: {
  border: string;
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    <div
      className="bg-[#0F1A24]/90 backdrop-blur-sm px-4 py-2"
      style={{ border: `2px solid ${border}` }}
    >
      <div
        className="text-3xl font-black leading-none"
        style={{ color: valueColor ?? "#ffffff" }}
      >
        {value}
      </div>
      <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

/* Canvas helpers & charts */
function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
) {
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W: cssWidth, H: cssHeight };
}
function EconomyBars({ gpm, cs }: { gpm: number; cs: number }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const { ctx, W, H } = setupHiDPICanvas(canvas, 280, 120);
    ctx.clearRect(0, 0, W, H);

    const pad = 14;
    const innerH = H - pad * 2;
    const barW = (W - pad * 3) / 2;
    const baseY = H - pad;

    const maxGpm = Math.max(1, gpm) * 1.25;
    const maxCs = Math.max(1, cs) * 1.5;

    const drawBar = (
      x: number,
      value: number,
      max: number,
      color: string,
      label: string,
      vLabel: string,
    ) => {
      const h = Math.max(6, (innerH * value) / max);
      ctx.fillStyle = "#182230";
      ctx.fillRect(x, baseY - innerH, barW, innerH);
      ctx.fillStyle = color;
      ctx.fillRect(x, baseY - h, barW, h);

      ctx.fillStyle = "#7e91a6";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, x + barW / 2, baseY + 12);

      ctx.fillStyle = "#C89B3C";
      ctx.font = "bold 12px system-ui";
      ctx.fillText(vLabel, x + barW / 2, baseY - h - 6);
    };

    drawBar(pad, gpm, maxGpm, "#C89B3C", "Gold/min", `${gpm.toFixed(0)}`);
    drawBar(pad * 2 + barW, cs, maxCs, "#0AC8B9", "CS/min", `${cs.toFixed(2)}`);
  }, [gpm, cs]);
  return <canvas ref={ref} />;
}
function TimeDeadRing({
  percent,
  deadSeconds,
  totalSeconds,
}: {
  percent: number;
  deadSeconds: number;
  totalSeconds: number;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const p = Math.max(0, Math.min(100, percent));

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const { ctx, W, H } = setupHiDPICanvas(canvas, 280, 140);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + 4;
    const outerR = 46;
    const innerR = 32;
    const start = -Math.PI / 2;
    const end = start + (Math.PI * 2 * p) / 100;

    ctx.beginPath();
    drawDonut(ctx, cx, cy, outerR, innerR);
    ctx.fillStyle = "#182230";
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, start, end, false);
    ctx.arc(cx, cy, innerR, end, start, true);
    ctx.closePath();
    ctx.fillStyle = "#DC4446";
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${p.toFixed(1)}%`, cx, cy - 2);

    ctx.fillStyle = "#7e91a6";
    ctx.font = "11px system-ui";
    const minsDead = Math.round(deadSeconds / 60);
    const minsTotal = Math.round(totalSeconds / 60);
    ctx.fillText(`${minsDead}m / ${minsTotal}m`, cx, cy + 16);
  }, [p, deadSeconds, totalSeconds]);

  return <canvas ref={ref} />;
}
function drawDonut(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
) {
  ctx.moveTo(cx + outerR, cy);
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2, false);
  ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true);
  ctx.closePath();
}
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0A1018] p-3">
      <div className="text-[#5A6B7A] text-[10px] uppercase tracking-wider mb-1">
        {title}
      </div>
      {children}
    </div>
  );
}
