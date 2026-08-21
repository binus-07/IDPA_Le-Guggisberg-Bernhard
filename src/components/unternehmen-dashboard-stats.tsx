import { FolderOpen, TrendingUp, Star, Users } from "lucide-react";
import { DashboardStatsCard } from "@/components/dashboard-stats-card";
import type { Freelancer } from "@/lib/types/freelancer";
import type { Projekt } from "@/lib/types/projekt";

function formatChf(betrag: number): string {
  return `CHF ${betrag.toLocaleString("de-CH")}`;
}

export function UnternehmenDashboardStats({
  projekte,
  topFreelancer,
}: {
  projekte: Projekt[];
  topFreelancer: Freelancer[];
}) {
  const laufendeProjekte = projekte.filter((p) =>
    p.teilaufgaben.some((t) => t.fortschrittProzent < 100),
  ).length;
  const ausgegeben = projekte
    .flatMap((p) => p.teilaufgaben)
    .reduce((summe, t) => summe + (t.betragChf ?? 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatsCard
        label="Laufende Projekte"
        value={laufendeProjekte}
        icon={<FolderOpen size={24} />}
      />
      <DashboardStatsCard
        label="Ausgegeben"
        value={formatChf(ausgegeben)}
        icon={<TrendingUp size={24} />}
      />
      <DashboardStatsCard
        label="Bewertung"
        value="4.8 ★"
        icon={<Star size={24} />}
        variant="success"
      />
      <DashboardStatsCard
        label="Top Freelancer"
        value={topFreelancer.length}
        icon={<Users size={24} />}
      />
    </div>
  );
}
