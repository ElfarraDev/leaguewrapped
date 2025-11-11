export const BEDROCK_BASE =
  process.env.NEXT_PUBLIC_BEDROCK_API_URL ||
  "https://leaguewrapped.xyz/bedrock";

export async function bedrockGenerate(prompt: string, stats?: any) {
  const res = await fetch(`${BEDROCK_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, stats: stats ?? {} }),
  });

  const text = await res.text();

  if (!res.ok || text.startsWith("<!DOCTYPE html")) {
    throw new Error(
      `Bedrock request failed (${res.status}). Check BEDROCK_BASE and route.`
    );
  }
  return JSON.parse(text) as {
    response: string;
    model_used: string;
    timestamp: string;
  };
}
