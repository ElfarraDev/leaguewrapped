import React from "react";
import { Scenario } from "./useParallelScenarios";

type Props = {
  scenarios: Scenario[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function ScenarioSelector({
  scenarios,
  selectedIndex,
  onSelect,
}: Props) {
  if (!scenarios?.length) return null;

  return (
    <div className="w-full mt-4 mb-10">
      {/* Wraps; no horizontal scrolling */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        {scenarios.map((s, i) => {
          const isActive = i === selectedIndex;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              className={`px-4 py-2 rounded-xl border transition-all ${
                isActive
                  ? "border-[#C89B3C] bg-[#1A2432]"
                  : "border-[#1E2A38] bg-[#0F1622] hover:bg-[#131F2C] hover:border-[#2A3A48]"
              }`}
              style={{
                boxShadow: isActive
                  ? "0 0 0 1px rgba(200,155,60,0.25), 0 8px 24px rgba(0,0,0,.35)"
                  : "none",
              }}
              aria-pressed={isActive}
            >
              <span className="text-sm font-semibold text-white">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Small dots for quick nav */}
      <div className="flex justify-center gap-2 mt-6">
        {scenarios.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "bg-[#C89B3C] w-8"
                : "bg-[#1E2A38] hover:bg-[#C89B3C]/50"
            }`}
            aria-label={`Go to scenario ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Export default too (so either import style works)
export default ScenarioSelector;
