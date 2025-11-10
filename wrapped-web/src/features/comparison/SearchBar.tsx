"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (summonerName: string, region: string) => void;
  isLoading: boolean;
  onClear?: () => void;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState("NA1");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summonerName.trim()) {
      onSearch(summonerName.trim(), region);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Search Input with Region Dropdown */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            placeholder="Enter Summoner Name..."
            className="w-full px-5 py-4 bg-[#131B28] border-2 border-[#1E2A38] text-white text-base placeholder-[#5A6B7A] focus:outline-none focus:border-[#C89B3C] transition-colors font-medium"
            disabled={isLoading}
          />
          {summonerName && !isLoading && (
            <button
              type="button"
              onClick={() => setSummonerName("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B7A] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>

        {/* Modern Dropdown - Landing Page Style */}
        <div className="relative">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            disabled={isLoading}
            className="appearance-none w-[140px] px-5 py-4 bg-[#131B28] border-2 border-[#1E2A38] text-white text-base font-semibold focus:outline-none focus:border-[#C89B3C] transition-all cursor-pointer hover:border-[#C89B3C]/50 hover:bg-[#1A2330]"
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
        disabled={isLoading || !summonerName.trim()}
        className="relative w-full px-5 py-4 bg-[#C89B3C] hover:bg-[#D4AA4D] disabled:bg-[#1E2A38] disabled:text-[#5A6B7A] disabled:cursor-not-allowed text-[#0F1A24] font-bold text-base transition-all overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#C89B3C]">
            <div className="w-5 h-5 border-2 border-[#0F1A24] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <span
          className={
            isLoading ? "opacity-0" : "flex items-center justify-center gap-2"
          }
        >
          {!isLoading && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          )}
          Compare
        </span>
      </button>
    </form>
  );
}
