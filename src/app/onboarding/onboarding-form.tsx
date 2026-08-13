"use client";

import { useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onboarding, type OnboardingState } from "./actions";

const initialState: OnboardingState = {};

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(onboarding, initialState);

  return (
    <Card className="w-full max-w-2xl [--card-spacing:--spacing(12)]">
      <CardHeader>
        <CardTitle className="text-h2 text-foreground">Willkommen</CardTitle>
        <CardDescription className="text-body-light">
          Wähle deine Rolle und einen Anzeigenamen &ndash; das dauert nur einen Moment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Label htmlFor="anzeigename">Anzeigename</Label>
            <Input id="anzeigename" name="anzeigename" type="text" maxLength={80} required />
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-body text-foreground">Ich bin …</span>
            {/* Wie die Promo-Kacheln von Screen 1 (Kartenflaeche, Titel in Anton, kurze
                Beschreibung, Aktion), aber ohne die ueberstehenden Bilder -- die Spiegelung waere
                bei einer reinen Rollenauswahl sinnlos (Abschnitt 9). */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="submit"
                name="rolle"
                value="unternehmen"
                disabled={pending}
                className="flex flex-col items-start gap-3 rounded-lg bg-card p-8 text-left transition-colors hover:bg-[color-mix(in_oklch,var(--card),var(--foreground)_5%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="text-h3 text-foreground">Unternehmen</span>
                <span className="text-body-light text-muted-foreground">
                  Ich suche Marketing-Freelancer.
                </span>
              </button>
              <button
                type="submit"
                name="rolle"
                value="freelancer"
                disabled={pending}
                className="flex flex-col items-start gap-3 rounded-lg bg-card p-8 text-left transition-colors hover:bg-[color-mix(in_oklch,var(--card),var(--foreground)_5%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="text-h3 text-foreground">Freelancer</span>
                <span className="text-body-light text-muted-foreground">
                  Ich biete Marketing-Leistungen an.
                </span>
              </button>
            </div>
          </div>
          {state.error ? (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
