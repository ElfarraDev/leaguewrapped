"use client";

import React, { useEffect, useMemo, useState } from "react";
import { WrappedData } from "@/types/wrapped.types";
import SearchBar from "./SearchBar";
import ComparisonView from "./ComparisonView";
import ScrollButton from "@/components/navigation/ScrollButton";

export default function FriendComparisonPage({
  userData,
  onScrollDown, // NEW: so Dashboard can pass the section navigator
}: {
  userData: WrappedData;
  onScrollDown?: () => void;
}) {
  const [friendData, setFriendData] = useState<WrappedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScroll, setShowScroll] = useState(true);

  const onSearch = async (summonerName: string, region: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/wrapped/${encodeURIComponent(summonerName)}/${region}`,
      );
      if (!res.ok) throw new Error("Failed to fetch summoner data");
      const data = await res.json();
      setFriendData(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e?.message ?? "Error fetching data");
      setFriendData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY < 100 && !friendData);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [friendData]);

  const newComparison = () => {
    setFriendData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CHANGE: use a different champ background than dashboard/DNA/roast
  const bgChampion = useMemo(() => {
    const second =
      userData?.BestChampionsByWinRate?.[1]?.Name ||
      userData?.BestChampionsByWinRate?.[0]?.Name;
    return second || "Lux";
  }, [userData]);

  const userChampion =
    userData?.TopChampion?.Name ||
    userData?.BestChampionsByWinRate?.[0]?.Name ||
    "Ahri";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0F1A24] text-white">
      {/* different background champ */}
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

      {!friendData ? (
        <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <div
            className="w-full max-w-5xl bg-[#121A26]/90 backdrop-blur-md border border-[#223043] p-12 md:p-14 animate-[pop_260ms_ease]"
            style={{
              borderRadius: 24,
              boxShadow:
                "0 40px 100px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05)",
            }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-[#C89B3C]/30">
              <div className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full animate-pulse" />
              <span className="text-[#C89B3C] font-semibold text-xs tracking-wider">
                FRIEND COMPARISON
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mb-10">
              <div className="flex items-center justify-end gap-6">
                <div className="text-right">
                  <div className="text-xs text-[#5A6B7A] uppercase tracking-wider mb-1">
                    You
                  </div>
                  <div className="text-2xl md:text-3xl font-black">
                    {userData.SummonerName}
                  </div>
                  <div className="text-[11px] text-[#C89B3C] font-bold">
                    #
                    {userData.Region.toUpperCase() === "AMERICAS"
                      ? "NA1"
                      : userData.Region.toUpperCase()}
                  </div>
                  <div className="text-[11px] text-[#A0ADB7] mt-1">
                    {userChampion}
                  </div>
                </div>
                <SquareAvatar champion={userChampion} size={112} />
              </div>

              <div className="relative px-2">
                <div className="w-16 h-16 flex items-center justify-center bg-[#131B28] border border-[#2A3A48] rounded-2xl">
                  <span className="text-2xl font-black text-[#5A6B7A]">VS</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <QuestionAvatar size={112} />
                <div className="text-left">
                  <div className="text-xs text-[#5A6B7A] uppercase tracking-wider mb-1">
                    Friend
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-[#5A6B7A]">
                    ?
                  </div>
                  <div className="text-[11px] text-[#5A6B7A] font-bold">
                    # —
                  </div>
                  <div className="text-[11px] text-[#5A6B7A] mt-1">
                    Champion
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-3">
              <span className="text-[#C89B3C]">Compare</span> your stats
            </h2>
            <p className="text-[#A0ADB7] mb-10 text-lg">
              Side-by-side. Minimal. Honest. Enter a friend’s Summoner to begin.
            </p>

            <SearchBar onSearch={onSearch} isLoading={isLoading} />
            {error && (
              <div className="mt-5 p-4 bg-[#DC4446]/10 border-l-4 border-[#DC4446] text-[#DC4446]">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Only one arrow: FriendComparisonPage controls its own arrow */}
          {showScroll && onScrollDown && (
            <ScrollButton
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              onClick={onScrollDown}
            />
          )}
        </section>
      ) : (
        <section className="relative z-10">
          <ComparisonView
            userData={userData}
            friendData={friendData}
            onNewComparison={newComparison}
          />
        </section>
      )}

      <style jsx>{`
        @keyframes pop {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function SquareAvatar({
  champion,
  size = 96,
}: {
  champion: string;
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 blur-2xl opacity-40"
        style={{ background: "#C89B3C33", borderRadius: 20 }}
      />
      <div
        className="relative overflow-hidden bg-[#0F1A24] border border-[#2A3A48] rounded-2xl"
        style={{ width: size, height: size }}
      >
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_0.jpg`}
          alt={champion}
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 35%" }}
        />
      </div>
    </div>
  );
}

function QuestionAvatar({ size = 96 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 blur-2xl opacity-30"
        style={{ background: "#0AC8B933", borderRadius: 20 }}
      />
      <div
        className="relative bg-[#1E2A38] border border-[#2A3A48] rounded-2xl flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-4xl md:text-5xl font-black text-[#8C97A3]">
          ?
        </span>
      </div>
    </div>
  );
}
