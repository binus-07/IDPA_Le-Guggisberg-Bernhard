import type { Metadata } from "next";
import { RegistrierenForm } from "./registrieren-form";

export const metadata: Metadata = {
  title: "Registrieren – IDPA Marketing-Freelancer-Plattform",
};

export default function RegistrierenPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <RegistrierenForm />
    </main>
  );
}
