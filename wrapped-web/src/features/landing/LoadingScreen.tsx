"use client";

import React, { useState, useEffect } from "react";

export default function LoadingScreen({
  summonerName,
  onComplete,
}: {
  summonerName: string;
  onComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Connecting to Riot Games API",
    "Retrieving match history",
    "Analyzing champion mastery",
    "Calculating performance metrics",
    "Generating your Wrapped",
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#0F1A24] text-white flex items-center justify-center relative overflow-hidden">
      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200, 155, 60, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200, 155, 60, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-[#C89B3C]/30">
            <div className="w-1.5 h-1.5 bg-[#C89B3C] rounded-full" />
            <span className="text-[#C89B3C] font-semibold text-xs tracking-wider">
              #LOLWrapped
            </span>
          </div>

          <h2 className="text-4xl font-black text-white mb-3">
            Preparing Your Wrapped
          </h2>
          <p className="text-[#A0ADB7] text-lg">
            Analyzing{" "}
            <span className="text-[#C89B3C] font-semibold">{summonerName}</span>
            's 2024 performance
          </p>
        </div>

        {/* Percentage Circle */}
        <div className="flex justify-center mb-12">
          <div className="relative w-48 h-48">
            {/* Background Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#1E2A38"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#C89B3C"
                strokeWidth="8"
                fill="none"
                strokeDasharray="552.92"
                strokeDashoffset={552.92 - (552.92 * progress) / 100}
                className="transition-all duration-100"
                strokeLinecap="round"
              />
            </svg>

            {/* Center Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-black text-[#C89B3C] mb-2">
                  {progress}%
                </div>
                <div className="text-sm text-[#5A6B7A] uppercase tracking-wider">
                  Loading
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1.5 bg-[#1E2A38] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C89B3C] to-[#D4AA4D] transition-all duration-100 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2.5">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-5 py-3.5 border-l-2 transition-all duration-200 ${
                i <= currentStep
                  ? "bg-[#131B28] border-[#C89B3C]"
                  : "bg-[#131B28]/40 border-[#1E2A38]"
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {i < currentStep ? (
                  <svg
                    className="w-4 h-4 text-[#C89B3C]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : i === currentStep ? (
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="w-1 h-1 rounded-full bg-[#C89B3C]"
                        style={{
                          animation: `pulse 1.2s ease-in-out infinite ${j * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#1E2A38]" />
                )}
              </div>

              {/* Text */}
              <span
                className={`text-base transition-colors ${
                  i <= currentStep ? "text-white font-medium" : "text-[#5A6B7A]"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
