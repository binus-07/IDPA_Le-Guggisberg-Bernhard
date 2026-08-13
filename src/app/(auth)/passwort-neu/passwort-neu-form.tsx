"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwortNeuSetzen, type PasswortNeuState } from "./actions";

const initialState: PasswortNeuState = {};

export function PasswortNeuForm() {
  const [state, formAction, pending] = useActionState(passwortNeuSetzen, initialState);

  return (
    <Card className="w-full max-w-[480px] [--card-spacing:--spacing(12)]">
      <CardHeader>
        <CardTitle className="text-h2 text-foreground">Neues Passwort</CardTitle>
        <CardDescription className="text-body-light">
          Wähle ein neues Passwort für dein Konto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Neues Passwort</Label>
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
            {pending ? "Speichern …" : "Passwort speichern"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
