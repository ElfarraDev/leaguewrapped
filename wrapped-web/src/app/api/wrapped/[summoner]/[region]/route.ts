import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { summoner: string; region: string } },
) {
  const { summoner, region } = params;
  // Convert region to uppercase to match API format
  const upperRegion = region.toUpperCase();

  try {
    // Use the new endpoint
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://api:5000" ||
      "http://backend:5000";

    const apiUrl = `${API_BASE_URL}/wrapped/${encodeURIComponent(summoner)}/${upperRegion}`;

    // const apiUrl = `http://44.223.109.198/api/wrapped/riot/${encodeURIComponent(summoner)}/${upperRegion}`;

    console.log("Fetching from:", apiUrl); // Debug log

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache options
      cache: "no-store", // or 'force-cache' depending on your needs
    });

    if (!response.ok) {
      console.error(`API returned ${response.status} for ${apiUrl}`);
      return NextResponse.json(
        { error: `Player not found or API returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from backend" },
      { status: 500 },
    );
  }
}
