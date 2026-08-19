import { Mail, Briefcase, Star, User } from "lucide-react";
import { DashboardStatsCard } from "@/components/dashboard-stats-card";
import type { Projekt, Teilaufgabe } from "@/lib/types/projekt";

export function FreelancerDashboardStats({
  offeneAnfragen,
  projekte,
}: {
  offeneAnfragen: Teilaufgabe[];
  projekte: Projekt[];
}) {
  const laufendeProjekte = projekte.filter((p) =>
    p.teilaufgaben.some((t) => t.fortschrittProzent < 100),
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatsCard
        label="Neue Anfragen"
        value={offeneAnfragen.length}
        icon={<Mail size={24} />}
      />
      <DashboardStatsCard
        label="Laufende Projekte"
        value={laufendeProjekte}
        icon={<Briefcase size={24} />}
      />
      <DashboardStatsCard
        label="Bewertung"
        value="4.5 ★"
        icon={<Star size={24} />}
        variant="success"
      />
      <DashboardStatsCard label="Profilvollständigkeit" value="85%" icon={<User size={24} />} />
    </div>
  );
}
