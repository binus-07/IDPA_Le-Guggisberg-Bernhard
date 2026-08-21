import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright (E2E-Tests) greift ueber 127.0.0.1 zu; ohne diesen Eintrag blockiert
  // Next.js 16 Dev-Ressourcen (HMR etc.) von diesem Origin standardmaessig.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // Freelancer-Profilbilder aus dem oeffentlichen Supabase-Storage-Bucket "freelancer-profiles"
    // (siehe supabase/migrations/20260821090000_freelancer_profilbild_rating_status.sql).
    // Wildcard statt fixem Projekt-Ref, damit next/image auch gegen die lokale/andere
    // Supabase-Projekte funktioniert.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Seed-Daten (data/Freelancer_Datenbank_Freelancer.csv, Spalte "Profilfoto (URL)")
      // verweisen auf randomuser.me-Portraits -- bewusste Mock-Zuordnung aus der bestehenden
      // CSV, kein zufaellig zugewiesenes Bild, siehe scripts/seed-freelancer.ts.
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
    ],
  },
};

export default nextConfig;
