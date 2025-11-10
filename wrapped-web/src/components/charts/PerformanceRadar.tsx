"use client";

import { useEffect, useRef } from "react";

interface PerformanceRadarProps {
  mechanics: number;
  farm: number;
  objective: number;
  teamwork: number;
  vision: number;
  size?: number;
}

export default function PerformanceRadar({
  mechanics,
  farm,
  objective,
  teamwork,
  vision,
  size = 180,
}: PerformanceRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // HiDPI crisp rendering
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;

    // Keep a comfortable margin for labels so they never clip
    const padding = 14; // safe padding
    const radius = size / 2 - (padding + 20); // 20px reserved for text

    const stats = [
      Math.max(0, Math.min(1, mechanics / 100)),
      Math.max(0, Math.min(1, farm / 100)),
      Math.max(0, Math.min(1, objective / 100)),
      Math.max(0, Math.min(1, teamwork / 100)),
      Math.max(0, Math.min(1, vision / 100)),
    ];
    const labels = ["Mechanics", "Farm", "Objective", "Teamwork", "Vision"];

    // Grid circles
    ctx.strokeStyle = "#1E2A38";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid lines
    for (let i = 0; i < stats.length; i++) {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    ctx.strokeStyle = "#C89B3C";
    ctx.fillStyle = "rgba(200, 155, 60, 0.2)";
    ctx.lineWidth = 2;

    for (let i = 0; i < stats.length; i++) {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius * stats[i];
      const y = centerY + Math.sin(angle) * radius * stats[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Points
    for (let i = 0; i < stats.length; i++) {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius * stats[i];
      const y = centerY + Math.sin(angle) * radius * stats[i];

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#C89B3C";
      ctx.fill();
    }

    // Labels (smart clamping to avoid cut-offs)
    ctx.fillStyle = "#A0ADB7";
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const labelDistance = 16; // pull labels a bit closer to avoid edge clipping
    for (let i = 0; i < labels.length; i++) {
      const angle = (Math.PI * 2 * i) / stats.length - Math.PI / 2;
      let x = centerX + Math.cos(angle) * (radius + labelDistance);
      let y = centerY + Math.sin(angle) * (radius + labelDistance);

      // Measure and clamp within canvas bounds
      const text = labels[i];
      const w = ctx.measureText(text).width;
      const half = w / 2;

      // Keep label within horizontal padding
      if (x - half < padding) x = padding + half;
      if (x + half > size - padding) x = size - padding - half;

      // Keep label within vertical padding
      const lineHeight = 11;
      if (y < padding) y = padding;
      if (y > size - padding) y = size - padding;

      ctx.fillText(text, x, y);
    }
  }, [mechanics, farm, objective, teamwork, vision, size]);

  return <canvas ref={canvasRef} style={{ imageRendering: "crisp-edges" }} />;
}
