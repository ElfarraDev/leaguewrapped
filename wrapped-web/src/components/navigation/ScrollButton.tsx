"use client";

import React from "react";

type ScrollButtonProps = {
  className?: string;
  label?: string;
  onClick?: () => void; // if omitted, scrolls down one viewport
};

export default function ScrollButton({
  className = "",
  label,
  onClick,
}: ScrollButtonProps) {
  const fallbackScroll = () => {
    if (typeof window !== "undefined") {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={onClick ?? fallbackScroll}
      className={`group inline-flex flex-col items-center gap-2 transition-all ${className}`}
      aria-label={label || "Scroll down"}
    >
      <div className="relative">
        <div className="relative w-12 h-12 bg-[#131B28] border border-[#2A3A48] rounded-2xl flex items-center justify-center transition-all group-hover:border-[#C89B3C]">
          <svg
            className="w-6 h-6 text-[#C89B3C] transition-transform group-hover:translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M6 9l6 6 6-6"
            />
          </svg>
        </div>
      </div>
      <span className="text-[#9AA8B5] text-xs font-semibold tracking-wide uppercase">
        {label || "Scroll Down"}
      </span>
    </button>
  );
}
