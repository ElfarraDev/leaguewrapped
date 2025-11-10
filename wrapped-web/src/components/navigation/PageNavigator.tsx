"use client";

import { useState, useEffect } from "react";

interface PageNavigatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const pageNames = ["Overview", "Roast Me"];

export default function PageNavigator({
  currentPage,
  totalPages,
  onPageChange,
}: PageNavigatorProps) {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {Array.from({ length: totalPages }).map((_, i) => (
        <div
          key={i}
          className="relative flex items-center gap-3"
          onMouseEnter={() => setHoveredPage(i)}
          onMouseLeave={() => setHoveredPage(null)}
        >
          {/* Page Label */}
          {hoveredPage === i && (
            <div className="absolute right-full mr-3 px-3 py-1 bg-[#C89B3C] text-[#0F1A24] text-xs font-bold whitespace-nowrap rounded animate-slideIn">
              {pageNames[i]}
            </div>
          )}

          {/* Dot */}
          <button
            onClick={() => onPageChange(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentPage === i
                ? "bg-[#C89B3C] scale-125"
                : "bg-[#5A6B7A] hover:bg-[#C89B3C] hover:scale-110"
            }`}
            aria-label={`Go to ${pageNames[i]}`}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
