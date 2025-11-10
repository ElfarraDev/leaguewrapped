"use client";

import React, { useMemo, useRef, useState } from "react";
import ScrollButton from "@/components/navigation/ScrollButton";
import { WrappedData } from "@/types/wrapped.types";
import { copyText } from "@/utils/safeCopy";

interface SharePageProps {
  data: WrappedData;
  onScrollDown?: () => void;
}

/** Choose a neutral “finale” splash champion (not Lee/Brand). */
const BG_CHAMP = "Lux"; // soft, celebratory vibe

function SharePage({ data, onScrollDown }: SharePageProps) {
  const [copied, setCopied] = useState(false);

  // Opaque, client-safe token (fine for a demo)
  const token = useMemo(() => {
    const payload = { s: data.SummonerName, r: data.Region, t: Date.now() };
    if (typeof window === "undefined") return "";
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  }, [data]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    return `${origin}/dashboard/${encodeURIComponent(
      data.SummonerName,
    )}/na1?share=${token}`;
  }, [data, token]);

  const handleCopy = async () => {
    const ok = await copyText(shareUrl);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1400);
  };

  // Final highlights (safe fallbacks)
  const topChamps = (data.BestChampionsByWinRate || []).slice(0, 5);
  const faveChamp = topChamps[0]?.Name ?? "Ashe";
  const faveChampWR = topChamps[0]?.WinRate ?? data.WinRate ?? 0;
  const kda = data.KDA?.toFixed?.(2) ?? "—";
  const wr = data.WinRate?.toFixed?.(1) ?? "—";
  const games = data.GamesPlayed ?? 0;
  const kp = data.KillParticipation?.toFixed?.(1) ?? "—";
  const dpm = data.DamagePerMinute?.toFixed?.(0) ?? "—";

  // 3D tilt effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const ry = (px - 0.5) * 14; // rotateY
    const rx = (py - 0.5) * -14; // rotateX
    setTilt({ rx, ry, glareX: px * 100, glareY: py * 100 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50 });

  return (
    <div className="relative min-h-screen w-full bg-[#0F1A24] text-white overflow-hidden">
      {/* Backdrop Champion */}
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${BG_CHAMP}_0.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center 28%",
          filter: "grayscale(25%) blur(2px)",
        }}
      />
      {/* Darken for contrast */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,26,36,0.82),rgba(15,26,36,1))]" />

      {/* Title */}
      <div className="relative z-10 pt-14 text-center">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 border border-[#C89B3C]/30">
          <div className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full animate-pulse" />
          <span className="text-[#C89B3C] font-semibold text-xs tracking-wider uppercase">
            Finale
          </span>
        </div>
        <h2 className="text-5xl font-black">
          Share Your <span className="text-[#C89B3C]">LoL Wrapped</span>
        </h2>
      </div>

      {/* 3D Card */}
      <div className="relative z-10 min-h-[70vh] flex items-center justify-center p-6">
        <div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative w-full max-w-5xl"
          style={{ perspective: "1600px" }}
        >
          <div
            className="relative bg-[#0A1018] border border-[#2A3A48] overflow-hidden"
            style={{
              borderRadius: 20,
              transformStyle: "preserve-3d",
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
              boxShadow:
                "0 40px 100px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)",
              transition: "transform 160ms ease",
            }}
          >
            {/* Fancy edge highlight (animated gradient border) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(200,155,60,0.14), transparent 35%, transparent 65%, rgba(10,200,185,0.12))",
                mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                padding: 1,
                borderRadius: 20,
              }}
            />

            {/* Glare */}
            <div
              className="pointer-events-none absolute"
              style={
                {
                  top: 0,
                  left: 0,
                  width: "160%",
                  height: "160%",
                  background:
                    "radial-gradient(300px 220px at var(--gx) var(--gy), rgba(255,255,255,.12), transparent 60%)",
                  transform: "translate(-30%, -30%)",
                  "--gx": `${tilt.glareX}%`,
                  "--gy": `${tilt.glareY}%`,
                } as React.CSSProperties
              }
            />

            {/* Background confetti (subtle) */}
            <div className="absolute inset-0 opacity-[0.06]">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(200,155,60,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(10,200,185,0.35) 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                }}
              />
            </div>

            {/* Top: Header + Link box */}
            <div className="relative z-10 p-6 md:p-8 border-b border-[#1E2A38]">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div>
                  <div className="text-xs text-[#5A6B7A] uppercase tracking-wider">
                    {data.Region.toUpperCase()}
                  </div>
                  <div className="text-3xl md:text-4xl font-black mt-1">
                    {data.SummonerName}
                  </div>
                  <div className="text-[#A0ADB7] text-sm">
                    {games.toLocaleString()} games • {wr}% WR • {kda} KDA
                  </div>
                </div>

                <div className="bg-[#0F1A24] border border-[#1E2A38] p-3 rounded-xl w-full md:w-[480px]">
                  <div className="text-[10px] text-[#5A6B7A] uppercase tracking-wider mb-1">
                    Share Link
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      className="flex-1 bg-transparent text-white text-sm md:text-base outline-none"
                      readOnly
                      value={shareUrl}
                      aria-label="Shareable link"
                    />
                    <button
                      onClick={handleCopy}
                      className="rounded-lg px-4 py-2 text-sm font-semibold border bg-[#131B28] border-[#2A3A48] hover:border-[#C89B3C] transition-all"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Image strip + Highlights */}
            <div className="relative z-10 p-6 md:p-8">
              {/* Champs strip (DDDragon) */}
              <div className="mb-6">
                <div className="text-[#5A6B7A] text-[10px] uppercase tracking-wider mb-2">
                  Champion Highlights
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {topChamps.length > 0
                    ? topChamps.map((c, idx) => (
                        <ChampIcon key={idx} champ={c.Name} />
                      ))
                    : ["Ashe", "Lux", "Caitlyn", "Ahri", "Jinx"].map((c) => (
                        <ChampIcon key={c} champ={c} />
                      ))}
                </div>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Tile label="Win Rate" value={`${wr}%`} accent="#0AC8B9" />
                <Tile label="KDA" value={String(kda)} accent="#C89B3C" />
                <Tile label="Kill Participation" value={`${kp}%`} />
                <Tile label="Damage / Min" value={String(dpm)} />
              </div>

              {/* Fave champion callout */}
              <div className="mt-6 bg-[#0F1A24] border border-[#1E2A38] p-4 md:p-5 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 shrink-0">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${faveChamp}.png`}
                      alt={faveChamp}
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
                        borderColor: "#C89B3C",
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-[#5A6B7A] uppercase tracking-wider">
                      Most Impactful
                    </div>
                    <div className="text-xl font-black">{faveChamp}</div>
                    <div className="text-[#A0ADB7] text-sm">
                      {faveChampWR.toFixed?.(1) ?? faveChampWR}% WR on this pick
                    </div>
                  </div>
                </div>

                {/* Optional scroll to finish */}
                {onScrollDown && (
                  <div className="hidden md:block">
                    <ScrollButton onClick={onScrollDown} />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="h-[1px] w-full bg-[linear-gradient(90deg,transparent,rgba(200,155,60,.5),transparent)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Small bits ===== */

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-[#0F1A24] border border-[#1E2A38] p-4 rounded-xl">
      <div className="text-[10px] text-[#5A6B7A] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className="text-2xl font-black"
        style={{ color: accent ?? "#ffffff" }}
      >
        {value}
      </div>
    </div>
  );
}

function ChampIcon({ champ }: { champ: string }) {
  return (
    <div className="relative w-14 h-14 shrink-0">
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champ}.png`}
        alt={champ}
        className="w-full h-full"
        style={{
          clipPath:
            "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
        }}
      />
      <div
        className="absolute inset-0 border border-[#2A3A48]"
        style={{
          clipPath:
            "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
        }}
      />
    </div>
  );
}

export default SharePage;
export { SharePage };
