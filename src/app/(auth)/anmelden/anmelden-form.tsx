"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { anmelden, type AnmeldenState } from "./actions";

export function AnmeldenForm({
  redirectTo,
  initialError,
}: {
  redirectTo: string;
  initialError?: string;
}) {
  const initialState: AnmeldenState = { error: initialError };
  const [state, formAction, pending] = useActionState(anmelden, initialState);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Anmelden</CardTitle>
        <CardDescription>Melde dich mit deinem Konto an.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="redirect" value={redirectTo} />
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
              autoComplete="current-password"
              required
            />
          </div>
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Anmelden …" : "Anmelden"}
          </Button>
        </form>
        <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
          <p>
            Noch kein Konto?{" "}
            <Link href="/registrieren" className="underline underline-offset-4">
              Registrieren
            </Link>
          </p>
          <p>
            <Link href="/passwort-vergessen" className="underline underline-offset-4">
              Passwort vergessen?
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
