import Link from "next/link";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import type { Freelancer } from "@/lib/types/freelancer";

export function FreelancerKarteKompakt({ freelancer }: { freelancer: Freelancer }) {
  return (
    <Link
      href={`/freelancer/${freelancer.id}`}
      className="card-hover flex min-w-0 flex-col items-center rounded-xl border border-border bg-card p-4 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative mb-4 w-full overflow-hidden rounded-lg aspect-square">
        <PlatzhalterBild
          alt={`Portrait von ${freelancer.name}`}
          radius="card"
          src={freelancer.bildSrc}
          sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <p className="text-body font-bold text-foreground mb-1">{freelancer.name}</p>
      <p className="text-small text-muted-foreground mb-2">{freelancer.rolle}</p>
      <div aria-hidden="true" className="flex text-primary text-sm">
        ★★★★★
      </div>
    </Link>
  );
}
