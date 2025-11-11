// wrapped-web/src/services/bedrock.service.ts

export type BedrockPayload = {
  prompt: string;
  stats?: Record<string, any>;
};

export type BedrockResponse = {
  response: string;
  model_used: string;
  timestamp: string;
};

export const BASE =
  process.env.NEXT_PUBLIC_BEDROCK_API_URL ||
  "https://leaguewrapped.xyz/bedrock";

export async function bedrockGenerate(
  payload: BedrockPayload,
): Promise<BedrockResponse> {
  const res = await fetch(`${BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Bedrock generate failed: ${res.status} ${msg}`);
  }

  // server returns JSON; parse once
  return res.json();
}
