import type { Metadata } from "next";
import { AnmeldenForm } from "./anmelden-form";

export const metadata: Metadata = {
  title: "Anmelden – IDPA Marketing-Freelancer-Plattform",
};

export default async function AnmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <AnmeldenForm redirectTo={redirectTo ?? ""} />
    </main>
  );
}
