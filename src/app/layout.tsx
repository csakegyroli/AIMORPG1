import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AImorpg — Fekete Érme",
  description: "AImorpg — Fekete Érme. Élő város, emlékező NPC-k, szinergikus felszerelés és AI-val támogatott narratív kaland.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
