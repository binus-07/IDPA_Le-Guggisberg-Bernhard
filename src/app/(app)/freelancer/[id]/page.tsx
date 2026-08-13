import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { enforceRouteGuard } from "@/lib/auth/server-guard";
import { getFreelancer } from "@/lib/mock/freelancer";
import { FreelancerDetailInhalt } from "./inhalt";

export async function generateMetadata({
  params,
}: PageProps<"/freelancer/[id]">): Promise<Metadata> {
  const { id } = await params;
  const freelancer = getFreelancer(id);
  return { title: freelancer ? `${freelancer.name} – Freelancer` : "Freelancer nicht gefunden" };
}

export default async function FreelancerDetailPage({ params }: PageProps<"/freelancer/[id]">) {
  const { id } = await params;
  await enforceRouteGuard(`/freelancer/${id}`);
  const freelancer = getFreelancer(id);

  if (!freelancer) {
    notFound();
  }

  return <FreelancerDetailInhalt freelancer={freelancer} />;
}
