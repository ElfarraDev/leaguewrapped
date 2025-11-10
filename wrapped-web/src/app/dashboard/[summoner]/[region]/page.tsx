"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/features/landing/LoadingScreen";
import DashboardView from "@/features/dashboard/DashboardView";
import { useWrappedStore } from "@/store/useWrappedStore";

export default function DashboardPage({
  params,
}: {
  params: { summoner: string; region: string };
}) {
  const { summoner, region } = params;
  const [showLoading, setShowLoading] = useState(true);
  const router = useRouter();

  const { data, loading, error, fetchData } = useWrappedStore();

  useEffect(() => {
    // Start fetching data
    fetchData(summoner, region);
  }, [summoner, region, fetchData]);

  // Hide loading screen when data is ready
  useEffect(() => {
    if (!loading && (data || error)) {
      setShowLoading(false);
    }
  }, [loading, data, error]);

  if (showLoading) {
    return (
      <LoadingScreen
        summonerName={summoner}
        onComplete={() => setShowLoading(false)}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F1A24] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 text-[#DC4446]">Error</h1>
          <p className="text-[#A0ADB7] mb-8">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#C89B3C] text-[#0F1A24] font-bold rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0F1A24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <DashboardView data={data} />;
}
