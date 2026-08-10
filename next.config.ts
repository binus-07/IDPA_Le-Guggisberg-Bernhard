import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright (E2E-Tests) greift ueber 127.0.0.1 zu; ohne diesen Eintrag blockiert
  // Next.js 16 Dev-Ressourcen (HMR etc.) von diesem Origin standardmaessig.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
