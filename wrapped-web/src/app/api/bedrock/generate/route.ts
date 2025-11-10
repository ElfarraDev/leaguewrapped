import { NextRequest, NextResponse } from "next/server";

const BEDROCK_INTERNAL_URL =
  process.env.BEDROCK_API_URL || "http://bedrock-api:5001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const r = await fetch(`${BEDROCK_INTERNAL_URL}/bedrock/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // IMPORTANT: server-side fetch, no CORS issues
      // Do NOT use cache; you want fresh generations
      cache: "no-store",
    });

    const text = await r.text();
    if (!r.ok) {
      // FastAPI returns JSON error; but on networking issues you might get HTML
      // Normalize error shape for the client
      return NextResponse.json(
        {
          error: true,
          status: r.status,
          message: safeErrorMessage(text),
        },
        { status: r.status },
      );
    }

    // If FastAPI returns JSON, forward as-is
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: true, status: 500, message: e?.message || "Proxy error" },
      { status: 500 },
    );
  }
}

function safeErrorMessage(payload: string) {
  // Strip any gigantic HTML
  if (payload?.startsWith("<!DOCTYPE html") || payload?.includes("<html")) {
    return "Upstream returned an HTML error page (likely a wrong URL or 404). Check BEDROCK_API_URL and FastAPI route.";
  }
  return payload?.slice(0, 500) || "Unknown upstream error";
}
