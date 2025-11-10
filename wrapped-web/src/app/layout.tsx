import type { Metadata } from "next";
import "./globals.css";
import CoachDock from "@/features/coach/CoachDock"; // <— changed

export const metadata: Metadata = {
  title: "LOL Wrapped 2025",
  description: "Your League of Legends 2025 Wrapped",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <CoachDock /> {/* shows on all pages EXCEPT those in HIDE_ON */}
      </body>
    </html>
  );
}
