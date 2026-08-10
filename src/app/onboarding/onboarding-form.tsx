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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Willkommen</CardTitle>
        <CardDescription>
          Wähle deine Rolle und einen Anzeigenamen &ndash; das dauert nur einen Moment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="anzeigename">Anzeigename</Label>
            <Input id="anzeigename" name="anzeigename" type="text" maxLength={80} required />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Ich bin …</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="submit"
                name="rolle"
                value="unternehmen"
                disabled={pending}
                className="flex flex-col items-start gap-1 rounded-lg border border-input p-4 text-left transition-colors hover:border-primary hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="font-heading text-lg">Unternehmen</span>
                <span className="text-sm text-muted-foreground">
                  Ich suche Marketing-Freelancer.
                </span>
              </button>
              <button
                type="submit"
                name="rolle"
                value="freelancer"
                disabled={pending}
                className="flex flex-col items-start gap-1 rounded-lg border border-input p-4 text-left transition-colors hover:border-primary hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
              >
                <span className="font-heading text-lg">Freelancer</span>
                <span className="text-sm text-muted-foreground">
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
