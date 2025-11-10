// src/utils/safeId.ts
export function safeId(): string {
  const g: any = (
    typeof globalThis !== "undefined" ? globalThis : window
  ) as any;

  if (g?.crypto?.randomUUID) return g.crypto.randomUUID();

  const cryptoObj = g?.crypto || g?.msCrypto;
  if (cryptoObj?.getRandomValues) {
    const buf = new Uint8Array(16);
    cryptoObj.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
