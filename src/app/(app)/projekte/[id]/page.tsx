import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getProjekt } from "@/lib/mock/projekte";
import { ladeProjekt } from "../actions";
import { ProjektDetailInhalt } from "./inhalt";

export async function generateMetadata({ params }: PageProps<"/projekte/[id]">): Promise<Metadata> {
  const { id } = await params;
  const projekt = getProjekt(id) ?? await ladeProjekt(id);
  return { title: projekt ? `${projekt.titel} – Projekt` : "Projekt nicht gefunden" };
}

export default async function ProjektDetailPage({ params }: PageProps<"/projekte/[id]">) {
  const { id } = await params;
  await enforceRouteGuard(`/projekte/${id}`);
  const projekt = getProjekt(id) ?? await ladeProjekt(id);

  if (!projekt) {
    notFound();
  }

  return <ProjektDetailInhalt projekt={projekt} />;
}
