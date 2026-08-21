import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  titel,
  text,
  ctaLabel,
  ctaHref,
}: {
  icon: ReactNode;
  titel: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <h3 className="text-h2 text-foreground mb-2">{titel}</h3>
      <p className="text-body-light text-muted-foreground mb-6 max-w-sm">{text}</p>
      {ctaLabel && ctaHref && (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
