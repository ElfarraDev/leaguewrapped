"use client";

import { useEffect, useRef } from "react";

interface KDATrendChartProps {
  kda: number;
}

export default function KDATrendChart({ kda }: KDATrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate trend data around the actual KDA with some variance
    const data = Array.from({ length: 15 }, (_, i) => {
      const variance = (Math.random() - 0.5) * 0.6;
      return Math.max(0.5, kda + variance);
    });

    const padding = 5;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    const maxKDA = Math.max(...data) * 1.2;

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = "#C89B3C";
    ctx.lineWidth = 2;

    data.forEach((value, i) => {
      const x = padding + (width / (data.length - 1)) * i;
      const y = padding + height - (value / maxKDA) * height;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Draw points
    data.forEach((value, i) => {
      const x = padding + (width / (data.length - 1)) * i;
      const y = padding + height - (value / maxKDA) * height;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#C89B3C";
      ctx.fill();
    });
  }, [kda]);

  return <canvas ref={canvasRef} width={280} height={80} />;
}
