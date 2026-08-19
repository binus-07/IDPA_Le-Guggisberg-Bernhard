import Link from "next/link";
import { PlatzhalterBild } from "@/components/platzhalter-bild";
import { cn } from "@/lib/utils";

const FOKUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:rounded-xl";

export function BildKarte({
  label,
  href,
  bildAlt,
}: {
  label: string;
  href?: string;
  bildAlt: string;
}) {
  const inhalt = (
    <div className={cn("card-hover relative h-48 min-w-0 overflow-hidden rounded-xl border border-border group", href && "cursor-pointer")}>
      <PlatzhalterBild
        alt={bildAlt}
        radius="card"
        className="absolute inset-0 h-full w-full opacity-60 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <p className="absolute bottom-4 left-4 font-heading font-normal text-white" style={{ fontSize: "24px", lineHeight: "1.2" }}>
        {label}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn("block min-w-0", FOKUS)}>
        {inhalt}
      </Link>
    );
  }

  return inhalt;
}
