import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DashboardStatsCard({
  label,
  value,
  icon,
  variant = "default",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "default" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-6",
        variant === "success" ? "border-primary/30 bg-primary/5" : "border-border bg-card",
      )}
    >
      {icon && (
        <div
          className={cn("mb-3", variant === "success" ? "text-primary" : "text-muted-foreground")}
        >
          {icon}
        </div>
      )}
      <p className="text-small text-muted-foreground mb-1">{label}</p>
      <p className="text-h2 text-foreground">{value}</p>
    </div>
  );
}
