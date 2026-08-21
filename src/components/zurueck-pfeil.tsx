"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function ZurueckPfeil({ label }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label={label ? `Zurueck zu ${label}` : "Zurueck"}
      className="flex items-center text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <ArrowLeft aria-hidden="true" className="size-[32px] sm:size-[38px]" />
    </button>
  );
}
