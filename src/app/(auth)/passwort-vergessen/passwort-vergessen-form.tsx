"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwortVergessenAnfordern, type PasswortVergessenState } from "./actions";

const initialState: PasswortVergessenState = {};

export function PasswortVergessenForm() {
  const [state, formAction, pending] = useActionState(passwortVergessenAnfordern, initialState);

  if (state.gesendet) {
    return (
      <Card className="w-full max-w-[480px] [--card-spacing:--spacing(12)]">
        <CardHeader>
          <CardTitle className="text-h2 text-foreground">E-Mail unterwegs</CardTitle>
          <CardDescription className="text-body-light">
            Falls ein Konto mit dieser Adresse existiert, haben wir einen Link zum Zurücksetzen des
            Passworts geschickt.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[480px] [--card-spacing:--spacing(12)]">
      <CardHeader>
        <CardTitle className="text-h2 text-foreground">Passwort vergessen</CardTitle>
        <CardDescription className="text-body-light">
          Wir schicken dir einen Link zum Zurücksetzen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Senden …" : "Link senden"}
          </Button>
        </form>
        <p className="text-body-light mt-4 text-muted-foreground">
          <Link href="/anmelden" className="underline underline-offset-4">
            Zurück zur Anmeldung
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
