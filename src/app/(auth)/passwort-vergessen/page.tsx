import type { Metadata } from "next";
import { PasswortVergessenForm } from "./passwort-vergessen-form";

export const metadata: Metadata = {
  title: "Passwort vergessen – IDPA Marketing-Freelancer-Plattform",
};

export default function PasswortVergessenPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <PasswortVergessenForm />
    </main>
  );
}
