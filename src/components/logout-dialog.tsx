"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

const FOKUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

export function LogoutDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsSubmitting(true);
    await signOut();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 max-w-[calc(100vw-32px)] rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-bold text-foreground">Wirklich abmelden?</h2>
        <p className="text-body-light mb-6 text-muted-foreground">
          Du wirst aus deinem Konto abgemeldet und musst dich erneut anmelden.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className={FOKUS_RING}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <form action={handleLogout}>
            <Button type="submit" className={FOKUS_RING} disabled={isSubmitting}>
              {isSubmitting ? "Wird abgemeldet..." : "Abmelden"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
