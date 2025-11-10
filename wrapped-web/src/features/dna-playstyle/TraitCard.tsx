"use client";

import React from "react";
import { PlaystyleTrait } from "./useDNAPlaystyle";

interface TraitCardProps {
  trait: PlaystyleTrait;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function TraitCard({
  trait,
  index,
  isSelected,
  onSelect,
}: TraitCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`bg-[#131B28] border-2 transition-all duration-300 cursor-pointer p-6 ${
        isSelected
          ? "border-[#C89B3C] scale-105"
          : "border-[#1E2A38] hover:border-[#C89B3C]/50"
      }`}
      style={{
        transform: isSelected
          ? "translateY(-8px) scale(1.05)"
          : "translateY(0) scale(1)",
        boxShadow: isSelected
          ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px ${trait.color}40`
          : "0 4px 12px rgba(0, 0, 0, 0.2)",
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Trait Name */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-white">{trait.name}</h4>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: trait.color }}
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#5A6B7A] text-xs uppercase tracking-wider">
            Proficiency
          </span>
          <span className="text-white font-bold text-lg">
            {trait.value}
            <span className="text-[#5A6B7A] text-sm">%</span>
          </span>
        </div>

        <div className="relative h-3 bg-[#0A1428] border border-[#1E2A38] overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(90deg, ${trait.color} 1px, transparent 1px)`,
              backgroundSize: "4px 100%",
            }}
          />

          {/* Progress Fill */}
          <div
            className="absolute inset-0 transition-all duration-1000 ease-out"
            style={{
              width: `${trait.value}%`,
              background: `linear-gradient(90deg, ${trait.color}00, ${trait.color})`,
              boxShadow: `0 0 10px ${trait.color}80`,
            }}
          />

          {/* Glow Effect */}
          <div
            className="absolute right-0 inset-y-0 w-1 transition-all duration-1000"
            style={{
              background: trait.color,
              boxShadow: `0 0 15px ${trait.color}`,
              transform: `translateX(${100 - trait.value}%)`,
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p
        className={`text-sm leading-relaxed transition-all duration-300 ${
          isSelected ? "text-[#A0ADB7]" : "text-[#5A6B7A]"
        }`}
      >
        {trait.description}
      </p>

      {/* Rating Labels */}
      <div className="mt-4 pt-4 border-t border-[#1E2A38] flex items-center justify-between text-xs">
        <span
          className={`${trait.value > 75 ? "text-[#C89B3C] font-bold" : "text-[#5A6B7A]"}`}
        >
          Elite
        </span>
        <span
          className={`${trait.value > 50 && trait.value <= 75 ? "text-[#C89B3C] font-bold" : "text-[#5A6B7A]"}`}
        >
          Strong
        </span>
        <span
          className={`${trait.value > 25 && trait.value <= 50 ? "text-[#C89B3C] font-bold" : "text-[#5A6B7A]"}`}
        >
          Average
        </span>
        <span
          className={`${trait.value <= 25 ? "text-[#C89B3C] font-bold" : "text-[#5A6B7A]"}`}
        >
          Developing
        </span>
      </div>

      {/* Hover Indicator */}
      {!isSelected && (
        <div className="mt-3 text-center text-[#5A6B7A] text-xs opacity-0 hover:opacity-100 transition-opacity">
          Click for details
        </div>
      )}
    </div>
  );
}
