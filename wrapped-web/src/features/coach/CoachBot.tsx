// src/features/coach/CoachBot.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { bedrockGenerate } from "@/services/bedrock.service";
import { WrappedData } from "@/types/wrapped.types";
import { useWrappedStore } from "@/store/useWrappedStore";
import { safeId } from "@/utils/safeId";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

type CoachBotProps = {
  data?: WrappedData; // optional; falls back to store
};

const GOLD = "#C89B3C";
const BG = "#0F1A24";
const PANEL = "#0A1018";
const BORDER = "#1E2A38";

export default function CoachBot({ data }: CoachBotProps) {
  // Hide on landing page
  const pathname = usePathname();
  if (pathname === "/") return null;

  // Prefer prop, then store
  const storeData = useWrappedStore((s) => (s as any).data);
  data = data ?? storeData ?? undefined;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // Seed welcome message on mount
  useEffect(() => {
    setChat([
      {
        id: safeId(),
        role: "assistant",
        ts: Date.now(),
        content:
          "I’m your Challenger-level coach. Ask me anything — want faster climbs, fewer deaths, or exact habits to fix tilt? I’ve read your 2025 stats.",
      },
    ]);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [chat, thinking, open]);

  const topChampName =
    data?.TopChampion?.Name ||
    data?.BestChampionsByWinRate?.[0]?.Name ||
    "Ashe";
  const coachAvatar = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${topChampName}_0.jpg`;

  // Pack system context using player stats
  const systemContext = useMemo(() => {
    if (!data) return "You are a Challenger League coach.";
    const avgVision =
      (data?.Vision?.VisionScore ?? 0) / Math.max(1, data?.GamesPlayed ?? 1);
    const csAt10 = data?.ai_coach?.behavior_patterns?.early_game?.cs_at_10_avg;
    const earlyDeaths =
      data?.ai_coach?.behavior_patterns?.early_game?.deaths_before_10_rate;
    const facechecks = data?.ai_coach?.behavior_patterns?.mid_game?.facechecks;
    const tilt = data?.ai_coach?.tilt_analysis?.tilt_likelihood;

    return [
      `You are a Challenger League coach.`,
      `User rank: ${data.Rank}, Games: ${data.GamesPlayed}, WR: ${data.WinRate.toFixed(1)}%, KDA: ${data.KDA.toFixed(2)}`,
      `Economy: ${data.Economy.GoldPerMinute.toFixed(0)} gpm, ${data.Economy.CSPerMinute.toFixed(2)} cs/min`,
      `Vision (avg): ${avgVision.toFixed(1)}, wards placed: ${data.Vision.WardsPlaced}, cleared: ${data.Vision.WardsKilled}`,
      `Early-game: deaths<10: ${earlyDeaths?.toFixed(2) ?? "N/A"}/g, CS@10: ${csAt10?.toFixed(0) ?? "N/A"}`,
      `Positioning: facechecks: ${facechecks ?? "N/A"}`,
      `Tilt likelihood: ${((tilt ?? 0) * 100).toFixed(0)}%, worst streak: ${data.ai_coach?.tilt_analysis?.worst_streak}`,
      `Top champs: ${(data.BestChampionsByWinRate ?? [])
        .slice(0, 3)
        .map((c) => `${c.Name} (${c.WinRate.toFixed(1)}% WR)`)
        .join(", ")}`,
      "",
      "STYLE:",
      "- Keep answers short (2–5 sentences) unless asked for more.",
      "- Be specific. Use numbers from the profile.",
      "- Always finish with ONE concrete next-game action.",
    ].join("\n");
  }, [data]);

  async function askCoach(query?: string) {
    const q = (query ?? input).trim();
    if (!q) return;
    setInput("");
    setError(null);

    const you: ChatMessage = {
      id: safeId(),
      role: "user",
      content: q,
      ts: Date.now(),
    };
    setChat((c) => [...c, you]);
    setThinking(true);

    try {
      const prompt = [
        `SYSTEM CONTEXT:\n${systemContext}`,
        "",
        "Recent conversation:",
        chat
          .slice(-8)
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n"),
        "",
        `USER: ${q}`,
        "",
        "COACH (2–5 sentences, end with a single next-game action):",
      ].join("\n");

      const res = await bedrockGenerate({
        prompt,
        stats: data
          ? {
              playerRank: data.Rank,
              games: data.GamesPlayed,
              kda: data.KDA,
              gpm: data.Economy.GoldPerMinute,
              cs: data.Economy.CSPerMinute,
              visionAvg:
                (data.Vision.VisionScore ?? 0) / Math.max(1, data.GamesPlayed),
            }
          : undefined,
      });

      const coach: ChatMessage = {
        id: safeId(),
        role: "assistant",
        content: res.response.trim(),
        ts: Date.now(),
      };
      setChat((c) => [...c, coach]);
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Try again.");
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      {/* Floating Pill Button (bigger + label) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-[60] group flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl"
        style={{
          background: BG,
          border: `1px solid ${BORDER}`,
        }}
        aria-label="Open AI Coach"
      >
        <div
          className="relative w-16 h-16 rounded-full overflow-hidden ring-2 shrink-0"
          style={{ borderColor: GOLD }}
        >
          <img
            src={coachAvatar}
            alt="Coach"
            className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        </div>
        <div className="flex flex-col items-start pr-1">
          <div className="text-white text-base font-extrabold leading-tight">
            AI Coach
          </div>
          <div className="text-[#A0ADB7] text-xs">Tap to open your panel</div>
        </div>
      </button>

      {/* Right-side Panel (no backdrop, won’t block page scroll) */}
      {open && (
        <div className="fixed inset-y-0 right-0 z-[70] flex">
          <div
            className="h-full w-[92vw] sm:w-[480px] md:w-[520px] bg-[#0A1018] border-l flex flex-col"
            style={{
              borderColor: BORDER,
              boxShadow: "0 8px 40px rgba(0,0,0,.55)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ borderColor: BORDER, background: "#0E1620" }}
            >
              <div
                className="relative w-10 h-10 rounded overflow-hidden ring-2 shrink-0"
                style={{ borderColor: GOLD }}
              >
                <img
                  src={coachAvatar}
                  alt="Coach"
                  className="w-full h-full object-cover object-[center_20%]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold leading-tight truncate">
                  AI Coach
                </div>
                <div className="text-[11px] text-[#A0ADB7] mt-0.5 truncate">
                  {data
                    ? `Tailored to ${data.SummonerName} • ${data.Rank}`
                    : "Connect your Wrapped to personalize"}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#A0ADB7] hover:text-white text-xl leading-none px-2"
                aria-label="Close"
                title="Close"
              >
                ×
              </button>
            </div>

            {/* Suggestions */}
            <div
              className="px-3 py-2 border-b flex gap-2 flex-wrap"
              style={{ borderColor: BORDER, background: "#0E1620" }}
            >
              {[
                "Lower my deaths fast",
                "Best champ pool plan?",
                "Fix my early game",
                "How to avoid tilt",
                "Vision habits for me",
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => askCoach(s)}
                  className="px-2.5 py-1 text-[11px] rounded border hover:bg-[#0F1A24] transition"
                  style={{ borderColor: BORDER, color: "#cbd5e1" }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Chat list */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ background: BG }}
            >
              {chat.map((m) =>
                m.role === "assistant" ? (
                  <CoachBubble key={m.id} content={m.content} />
                ) : (
                  <UserBubble key={m.id} content={m.content} />
                ),
              )}
              {thinking && <ThinkingBubble />}
              {error && (
                <div className="text-xs text-red-300 bg-red-900/20 border border-red-900/40 p-2 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                askCoach();
              }}
              className="p-3 border-t"
              style={{ borderColor: BORDER, background: PANEL }}
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your coach…"
                  className="flex-1 bg-[#0F1A24] text-white text-sm px-3 py-2 outline-none border rounded"
                  style={{ borderColor: BORDER }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="px-3 py-2 text-sm font-bold bg-[#C89B3C] text-[#0F1A24] disabled:opacity-60 rounded"
                >
                  Send
                </button>
              </div>
              <div className="text-[10px] text-[#7e91a6] mt-1">
                Tip: Ask for exact drills, ward timings, or a champ plan.
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Bubbles ---------- */

function CoachBubble({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-2 h-2 mt-3 rounded-full shrink-0"
        style={{ background: GOLD }}
      />
      <div
        className="max-w-[86%] bg-[#0A1018] border px-3 py-2 text-sm text-[#e5e7eb] rounded"
        style={{ borderColor: BORDER }}
      >
        {content}
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[86%] bg-[#1A2432] border px-3 py-2 text-sm text-white rounded"
        style={{ borderColor: "#2A3A48" }}
      >
        {content}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex items-center gap-2 text-[#cbd5e1] text-sm">
      <div
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: GOLD }}
      />
      <span>Thinking</span>
      <Dot />
      <Dot delay={150} />
      <Dot delay={300} />
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full animate-bounce"
      style={{
        background: "#cbd5e1",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}
