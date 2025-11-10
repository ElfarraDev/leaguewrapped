"use client";

interface ScrollIndicatorProps {
  show: boolean;
  onClick: () => void;
}

export default function ScrollIndicator({
  show,
  onClick,
}: ScrollIndicatorProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 text-[#C89B3C] hover:text-[#D4AA4D] transition-colors cursor-pointer animate-bounce"
      aria-label="Scroll to next page"
    >
      <span className="text-sm uppercase tracking-widest font-bold">
        Scroll Down
      </span>
    </button>
  );
}
