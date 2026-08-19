"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Menu, User as UserIcon, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import type { Rolle } from "@/lib/auth/route-guard";
import { Kugel } from "@/components/kugel";
import { LogoutDialog } from "@/components/logout-dialog";

const CHATS_LABEL = "Chats";

function navItems(rolle: Rolle | null): { href: string; label: string }[] {
  const homeHref = rolle === "freelancer" ? "/dashboard/freelancer" : "/dashboard/unternehmen";
  return [
    { href: homeHref, label: "Home" },
    { href: "/marketing-planung", label: "Marketing Planung" },
    { href: "/projekte", label: "Projekte" },
  ];
}

function istAktiv(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const FOKUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm";

export function AppShell({
  rolle,
  user,
  children,
}: {
  rolle: Rolle | null;
  user?: User | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOffen, setMenuOffen] = useState(false);
  const [kontoMenuOffen, setKontoMenuOffen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const items = navItems(rolle);

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <header className="relative z-10 mx-auto flex w-full max-w-[1680px] items-center justify-between px-6 py-6 md:px-10 lg:px-16 xl:px-[131px] xl:py-[42px]">
        <nav aria-label="Hauptnavigation" className="flex items-center">
          <button
            type="button"
            className={cn("text-foreground md:hidden", FOKUS_RING)}
            aria-expanded={menuOffen}
            aria-label={menuOffen ? "Menue schliessen" : "Menue oeffnen"}
            onClick={() => setMenuOffen((offen) => !offen)}
          >
            {menuOffen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <ul
            className={cn(
              "flex-col gap-6 md:flex md:flex-row md:items-center md:gap-8 xl:gap-12",
              menuOffen
                ? "absolute top-full left-0 flex w-full flex-col gap-6 bg-card px-6 py-6"
                : "hidden",
            )}
          >
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOffen(false)}
                  className={cn(
                    "text-body text-foreground",
                    istAktiv(pathname, item.href) ? "font-black" : "font-normal",
                    FOKUS_RING,
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <span
                aria-disabled="true"
                className="text-body cursor-not-allowed font-normal text-foreground/50"
              >
                {CHATS_LABEL}
              </span>
            </li>
          </ul>
        </nav>
        <div className="relative">
          {/*
            Bewusst kein role="menu"/"menuitem": das ARIA-Menu-Pattern verlangt
            Pfeiltasten-Navigation zwischen den Eintraegen, die dieses simple
            Ein-Aktion-Popover nicht implementiert -- die impliziten button-Rollen sind hier
            korrekter als ein unvollstaendiges ARIA-Widget.
          */}
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={kontoMenuOffen}
            aria-label="Konto-Menue"
            onClick={() => setKontoMenuOffen((offen) => !offen)}
            className={cn(
              "flex size-[61px] shrink-0 items-center justify-center rounded-full border-2 border-foreground text-foreground",
              FOKUS_RING,
            )}
          >
            <UserIcon aria-hidden="true" />
          </button>
          {kontoMenuOffen ? (
            <div className="absolute top-[calc(100%+8px)] right-0 min-w-56 rounded-lg border border-border bg-card p-0 shadow-none overflow-hidden">
              {user ? (
                <div className="border-b border-border bg-muted/30 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{user.email}</p>
                  {user.user_metadata?.username ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      @{user.user_metadata.username}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setLogoutDialogOpen(true);
                  setKontoMenuOffen(false);
                }}
                className={cn(
                  "text-body w-full rounded-none px-4 py-3 text-left text-foreground hover:bg-muted/50 transition-colors",
                  FOKUS_RING,
                )}
              >
                Abmelden
              </button>
            </div>
          ) : null}
        </div>
        <Kugel />
      </header>
      <main className="relative z-[1] flex flex-1 flex-col">{children}</main>
      <LogoutDialog isOpen={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} />
    </div>
  );
}
