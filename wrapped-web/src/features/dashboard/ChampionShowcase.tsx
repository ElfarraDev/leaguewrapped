"use client";

import { useState } from "react";
import { WrappedData } from "@/types/wrapped.types";

interface ChampionShowcaseProps {
  data: WrappedData;
}

export default function ChampionShowcase({ data }: ChampionShowcaseProps) {
  const [selectedChampion, setSelectedChampion] = useState(0);
  const topChampions = data.BestChampionsByWinRate.slice(0, 5);
  const currentChamp = topChampions[selectedChampion];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Champion Image */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute top-4 left-4 text-[#C89B3C] text-xs font-black uppercase tracking-widest z-10">
          Top Champion
        </div>

        <img
          key={selectedChampion}
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${currentChamp.Name}_0.jpg`}
          alt={currentChamp.Name}
          className="w-full h-full object-cover"
          style={{ animation: "fadeIn 0.5s ease-out" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A24] via-transparent to-transparent" />

        {/* Champion Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-5xl font-black text-white leading-none mb-2">
            {currentChamp.Name.toUpperCase()}
          </h2>
          <div className="text-[#5A6B7A] text-sm">
            {currentChamp.MasteryPoints.toLocaleString()} Mastery Points
          </div>
        </div>
      </div>

      {/* Champion Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-1">
            K/D Ratio
          </div>
          <div className="bg-[#C89B3C] text-[#0F1A24] font-black text-2xl px-4 py-2">
            {currentChamp.KDA.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-1">
            Win Rate
          </div>
          <div className="bg-[#0AC8B9] text-[#0F1A24] font-black text-2xl px-4 py-2">
            {currentChamp.WinRate.toFixed(0)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#5A6B7A] text-xs uppercase tracking-wider mb-1">
            Matches
          </div>
          <div className="bg-white text-[#0F1A24] font-black text-2xl px-4 py-2">
            {currentChamp.GamesPlayed}
          </div>
        </div>
      </div>

      {/* Champion Selector */}
      <div className="flex gap-2">
        {topChampions.map((champ, i) => (
          <button
            key={i}
            onClick={() => setSelectedChampion(i)}
            className={`flex-1 relative overflow-hidden transition-all duration-300 ${
              selectedChampion === i
                ? "ring-2 ring-[#C89B3C]"
                : "opacity-50 hover:opacity-100"
            }`}
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champ.Name}.png`}
              alt={champ.Name}
              className="w-full aspect-square object-cover"
            />
            {i === 0 && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-[#C89B3C] flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-[#0F1A24]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-[#0F1A24]/95 px-1 py-1">
              <div className="text-white text-[9px] font-bold truncate">
                {champ.Name}
              </div>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
