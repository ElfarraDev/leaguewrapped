"use client";

import { usePathname } from "next/navigation";
import CoachBot from "./CoachBot";

/**
 * Mounts the AI Coach only on routes where we want it.
 * Hidden on landing ("/") and any other routes you list in HIDE_ON.
 */
export default function CoachDock() {
  const pathname = usePathname();

  // Add any paths you want to hide it on:
  const HIDE_ON = new Set<string>([
    "/", // landing
    // "/share",       // uncomment if you want to hide on /share, etc.
  ]);

  // Exact-match check for now (simple). Expand if you need pattern rules.
  if (HIDE_ON.has(pathname ?? "")) return null;

  return <CoachBot />;
}
