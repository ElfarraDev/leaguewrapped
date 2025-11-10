"use client";
import React, { useEffect, useRef } from "react";

interface TraitWithColor {
  name: string;
  value: number;
  color: string;
  description: string;
}

export default function DNAStrandVisual({
  traits,
  height = 320,
}: {
  traits: TraitWithColor[];
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = parent ? parent.clientWidth : 800;
      const h = height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    let raf = 0;
    let offset = 0;
    const draw = () => {
      offset += 0.5;
      const w = canvas.clientWidth;
      const h = height;
      ctx.clearRect(0, 0, w, h);
      const centerY = h / 2;
      const amplitude = Math.min(80, Math.max(50, h * 0.22));
      const frequency = 0.01;
      const segments = 60;
      const segW = w / segments;

      for (let i = 0; i < segments; i++) {
        const x = i * segW;
        const angle = (x + offset) * frequency;
        const y1 = centerY + Math.sin(angle) * amplitude;
        const y2 = centerY - Math.sin(angle) * amplitude;

        // rung
        if (i % 3 === 0) {
          ctx.strokeStyle = "rgba(200, 155, 60, 0.15)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();
        }

        const traitIndex = Math.floor((i / segments) * traits.length);
        const color = traits[traitIndex]?.color ?? "#C89B3C";

        // dots
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y1, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [traits, height]);

  // Calculate positions for labels evenly distributed
  const topTraits = traits.slice(0, 3);
  const bottomTraits = traits.slice(3, 6);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${height}px` }}
    >
      {/* Top Labels Row */}
      <div className="absolute top-0 left-0 right-0 flex justify-around items-start px-12">
        {topTraits.map((trait) => (
          <div key={`top-${trait.name}`} className="flex flex-col items-center">
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: trait.color }}
            >
              {trait.name}
            </div>
            <div className="text-2xl font-black" style={{ color: trait.color }}>
              {trait.value}%
            </div>
          </div>
        ))}
      </div>

      {/* Canvas - centered with proper margins */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ paddingTop: "60px", paddingBottom: "60px" }}
      >
        <canvas ref={canvasRef} className="w-full" />
      </div>

      {/* Bottom Labels Row */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end px-12">
        {bottomTraits.map((trait) => (
          <div
            key={`bottom-${trait.name}`}
            className="flex flex-col items-center"
          >
            <div className="text-2xl font-black" style={{ color: trait.color }}>
              {trait.value}%
            </div>
            <div
              className="text-xs font-semibold mt-1"
              style={{ color: trait.color }}
            >
              {trait.name}
            </div>
          </div>
        ))}
      </div>

      {/* Side fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#131B28] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#131B28] to-transparent" />
    </div>
  );
}
