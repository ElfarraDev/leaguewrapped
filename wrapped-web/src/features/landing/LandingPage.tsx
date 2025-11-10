"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [searchValue, setSearchValue] = useState("");
  const [region, setRegion] = useState("NA1");
  const [focusedInput, setFocusedInput] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(false);
  const router = useRouter();

  const regions = [
    { value: "NA1", label: "NA", fullName: "North America" },
    { value: "EUW1", label: "EUW", fullName: "Europe West" },
    { value: "EUN1", label: "EUNE", fullName: "Europe Nordic & East" },
    { value: "KR", label: "KR", fullName: "Korea" },
    { value: "BR1", label: "BR", fullName: "Brazil" },
    { value: "JP1", label: "JP", fullName: "Japan" },
    { value: "RU", label: "RU", fullName: "Russia" },
    { value: "OC1", label: "OCE", fullName: "Oceania" },
    { value: "TR1", label: "TR", fullName: "Turkey" },
    { value: "LA1", label: "LAN", fullName: "Latin America North" },
    { value: "LA2", label: "LAS", fullName: "Latin America South" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Region is already uppercase, so we can use it directly
      router.push(`/dashboard/${searchValue}/${region}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1A24] text-white relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200, 155, 60, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200, 155, 60, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-[1400px] grid grid-cols-[1fr_1.2fr] gap-16 items-center">
          {/* Left - Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-[#C89B3C]/30">
              <div className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full" />
              <span className="text-[#C89B3C] font-semibold text-xs tracking-wider">
                #LOLWrapped
              </span>
            </div>

            {/* Title */}
            <h1 className="text-7xl font-black leading-[1.1] mb-6">
              <div className="text-white">Your League</div>
              <div className="text-[#C89B3C]">Wrapped Is Here.</div>
            </h1>

            {/* Description */}
            <p className="text-[#A0ADB7] text-lg mb-2 leading-relaxed">
              Get tailored graphics of your League of Legends
              <br />
              performance in 2025.
            </p>
            <p className="text-[#5A6B7A] text-sm mb-10">
              Search to get started!
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-3">
              {/* Search Input with Region Dropdown */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setFocusedInput(true)}
                    onBlur={() => setFocusedInput(false)}
                    placeholder="Enter Summoner Name..."
                    className="w-full px-5 py-4 bg-[#131B28] border text-white text-base placeholder-[#5A6B7A] focus:outline-none transition-colors"
                    style={{
                      borderColor: focusedInput ? "#C89B3C" : "#1E2A38",
                    }}
                  />
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6B7A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Modern Dropdown */}
                <div className="relative">
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="appearance-none w-[140px] px-5 py-4 bg-[#131B28] border border-[#1E2A38] text-white text-base font-semibold focus:outline-none focus:border-[#C89B3C] transition-all cursor-pointer hover:border-[#C89B3C]/50 hover:bg-[#1A2330]"
                  >
                    {regions.map((r) => (
                      <option
                        key={r.value}
                        value={r.value}
                        className="bg-[#131B28] text-white py-2"
                      >
                        {r.label}
                      </option>
                    ))}
                  </select>

                  {/* Custom Dropdown Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-[#C89B3C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Region Badge */}
                  <div className="absolute -top-2 -right-2 bg-[#C89B3C] px-1.5 py-0.5 text-[10px] font-black text-[#0F1A24]">
                    {region}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!searchValue.trim()}
                className="w-full px-5 py-4 bg-[#C89B3C] hover:bg-[#D4AA4D] disabled:bg-[#1E2A38] disabled:text-[#5A6B7A] disabled:cursor-not-allowed text-[#0F1A24] font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                VIEW MY WRAPPED
              </button>

              <p className="text-[#5A6B7A] text-xs text-center pt-1">
                *Searching will show your 2025 performance
              </p>
            </form>

            {/* Region Info Display */}
            <div className="mt-6 p-4 bg-[#131B28]/50 border border-[#1E2A38]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#C89B3C] rounded-full animate-pulse" />
                <div>
                  <div className="text-sm font-bold text-white">
                    {regions.find((r) => r.value === region)?.fullName}
                  </div>
                  <div className="text-xs text-[#5A6B7A]">Region: {region}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Preview Card */}
          <div
            className="relative"
            style={{ perspective: "1500px" }}
            onMouseEnter={() => setHoveredCard(true)}
            onMouseLeave={() => setHoveredCard(false)}
          >
            <div
              className={`bg-[#131B28] border-2 transition-all duration-500 ease-out ${
                hoveredCard ? "border-[#C89B3C]" : "border-[#1E2A38]"
              }`}
              style={{
                animation: "float 6s ease-in-out infinite",
                transform: hoveredCard
                  ? "translateY(-20px) translateZ(50px) scale(1.05) rotateX(2deg)"
                  : "translateY(0px) translateZ(0px) scale(1) rotateX(0deg)",
                transformStyle: "preserve-3d",
                boxShadow: hoveredCard
                  ? "0 30px 60px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(200, 155, 60, 0.2), 0 0 0 1px rgba(200, 155, 60, 0.1)"
                  : "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2A38]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#C89B3C] rounded-full" />
                  <span className="text-[#C89B3C] font-semibold text-xs tracking-wider">
                    #LOLWrapped
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    SummonerName
                  </span>
                  <span className="text-[#5A6B7A] text-xs">#NA1</span>
                  <button className="ml-2 px-3 py-1 bg-[#C89B3C] text-[#0F1A24] text-xs font-bold hover:bg-[#D4AA4D] transition-colors">
                    Share
                  </button>
                </div>
              </div>

              {/* Time Stats */}
              <div className="grid grid-cols-2 border-b border-[#1E2A38]">
                <div className="px-6 py-5 border-r border-[#1E2A38]">
                  <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-1">
                    Time Played
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-white">296</span>
                    <span className="text-lg font-bold text-[#5A6B7A]">
                      hrs
                    </span>
                  </div>
                  <div className="text-[#5A6B7A] text-xs mt-1">12.4 days</div>
                </div>
                <div className="px-6 py-5">
                  <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-1">
                    KDA Ratio
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-[#C89B3C]">
                      2.11
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs mt-1">
                    <span className="text-[#5A6B7A]">8.3 K</span>
                    <span className="text-[#5A6B7A]">6.5 D</span>
                    <span className="text-[#5A6B7A]">10.5 A</span>
                  </div>
                </div>
              </div>

              {/* Top Champion */}
              <div className="px-6 py-6 border-b border-[#1E2A38]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[#5A6B7A] text-xs uppercase tracking-wider">
                    Top Champion
                  </div>
                  <div className="px-2 py-0.5 bg-[#C89B3C]/10 border border-[#C89B3C]/30">
                    <span className="text-[#C89B3C] text-xs font-bold">
                      TOP
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <img
                    src="https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/Ahri.png"
                    alt="Ahri"
                    className="w-28 h-28 border-2 border-[#1E2A38] hover:border-[#C89B3C] transition-all duration-300"
                  />
                  <div className="flex-1">
                    <div className="text-3xl font-black text-white mb-1">
                      AHRI
                    </div>
                    <div className="text-sm text-[#5A6B7A] mb-3">
                      the Nine-Tailed Fox • 245,600 Mastery
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-[#C89B3C] font-bold text-lg">
                          3.2
                        </span>
                        <span className="text-[#5A6B7A] text-xs"> KDA</span>
                      </div>
                      <div>
                        <span className="text-white font-bold text-lg">
                          54.5%
                        </span>
                        <span className="text-[#5A6B7A] text-xs">
                          {" "}
                          Win Rate
                        </span>
                      </div>
                      <div>
                        <span className="text-white font-bold text-lg">
                          156
                        </span>
                        <span className="text-[#5A6B7A] text-xs"> Games</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="px-6 py-5 border-b border-[#1E2A38]">
                <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-4">
                  Performance Profile
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-white mb-1">
                      68.6%
                    </div>
                    <div className="text-xs text-[#5A6B7A]">
                      Kill Participation
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white mb-1">
                      54.5%
                    </div>
                    <div className="text-xs text-[#5A6B7A]">Win Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white mb-1">
                      652
                    </div>
                    <div className="text-xs text-[#5A6B7A]">Games</div>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="px-6 py-5 border-b border-[#1E2A38]">
                <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-4">
                  Objectives
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-[#0F1A24] px-3 py-2.5 border-l-2 border-[#DC4446]">
                    <div className="text-xs text-[#5A6B7A] mb-1">Dragons</div>
                    <div className="text-xl font-black text-white">456</div>
                  </div>
                  <div className="bg-[#0F1A24] px-3 py-2.5 border-l-2 border-[#C89B3C]">
                    <div className="text-xs text-[#5A6B7A] mb-1">Barons</div>
                    <div className="text-xl font-black text-white">89</div>
                  </div>
                  <div className="bg-[#0F1A24] px-3 py-2.5 border-l-2 border-[#0AC8B9]">
                    <div className="text-xs text-[#5A6B7A] mb-1">Heralds</div>
                    <div className="text-xl font-black text-white">178</div>
                  </div>
                  <div className="bg-[#0F1A24] px-3 py-2.5 border-l-2 border-[#F0B232]">
                    <div className="text-xs text-[#5A6B7A] mb-1">Turrets</div>
                    <div className="text-xl font-black text-white">432</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-[#0F1A24]/50">
                <p className="text-[#5A6B7A] text-xs text-center">
                  Get Yours at{" "}
                  <span className="text-[#C89B3C]">LeagueStats.gg/Wrapped</span>
                </p>
              </div>
            </div>

            {/* Enhanced Glow Layers */}
            <div
              className={`absolute inset-0 -z-10 blur-3xl transition-all duration-500 ${
                hoveredCard ? "opacity-20" : "opacity-0"
              }`}
              style={{
                backgroundColor: "#C89B3C",
                transform: hoveredCard ? "scale(1.1)" : "scale(1)",
              }}
            />
            <div
              className={`absolute inset-0 -z-20 blur-[100px] transition-all duration-500 ${
                hoveredCard ? "opacity-15" : "opacity-0"
              }`}
              style={{
                backgroundColor: "#C89B3C",
                transform: hoveredCard
                  ? "scale(1.2) translateY(20px)"
                  : "scale(1)",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
