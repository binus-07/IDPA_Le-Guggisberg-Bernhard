import type { Metadata } from "next";
import { PasswortNeuForm } from "./passwort-neu-form";

export const metadata: Metadata = {
  title: "Neues Passwort – IDPA Marketing-Freelancer-Plattform",
};

export default function PasswortNeuPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <PasswortNeuForm />
    </main>
  );
}
