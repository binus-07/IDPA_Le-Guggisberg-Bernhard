"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registrieren, type RegistrierenState } from "./actions";

const initialState: RegistrierenState = {};

export function RegistrierenForm() {
  const [state, formAction, pending] = useActionState(registrieren, initialState);

  if (state.emailBestaetigungNoetig) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Fast geschafft</CardTitle>
          <CardDescription>
            Wir haben dir eine E-Mail geschickt. Bitte bestätige deine Adresse über den Link
            darin, um die Registrierung abzuschliessen.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Registrieren</CardTitle>
        <CardDescription>Erstelle ein Konto für die Marketing-Freelancer-Plattform.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Registrieren …" : "Registrieren"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Schon ein Konto?{" "}
          <Link href="/anmelden" className="underline underline-offset-4">
            Anmelden
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
