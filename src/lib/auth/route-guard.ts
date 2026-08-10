export type Rolle = "unternehmen" | "freelancer" | "admin";

export interface RouteGuardInput {
  pathname: string;
  hasSession: boolean;
  rolle: Rolle | null;
}

const ONBOARDING_PATH = "/onboarding";
const DASHBOARD_PREFIX = "/dashboard/";
const AUTH_PAGES = ["/anmelden", "/registrieren"];

function isProtectedPath(pathname: string): boolean {
  return pathname === ONBOARDING_PATH || pathname.startsWith(DASHBOARD_PREFIX);
}

function dashboardRolleFor(pathname: string): Rolle | null {
  if (pathname === "/dashboard/unternehmen") return "unternehmen";
  if (pathname === "/dashboard/freelancer") return "freelancer";
  return null;
}

/**
 * Pure Entscheidungsfunktion fuer Routen-Umleitung, ohne Next-spezifische Typen.
 * Wird von src/proxy.ts UND server-seitig in jeder Dashboard-Page erneut aufgerufen
 * (Proxy ist keine Sicherheitsgrenze, siehe Next.js-Doku zu Proxy).
 *
 * Gibt den Ziel-Pfad zurueck, auf den umgeleitet werden soll, oder null, wenn der Zugriff
 * erlaubt ist.
 */
export function determineRedirect({ pathname, hasSession, rolle }: RouteGuardInput): string | null {
  if (isProtectedPath(pathname) && !hasSession) {
    return `/anmelden?redirect=${encodeURIComponent(pathname)}`;
  }

  if (!hasSession) {
    return null;
  }

  if (AUTH_PAGES.includes(pathname)) {
    return rolle ? `/dashboard/${rolle}` : ONBOARDING_PATH;
  }

  if (pathname === ONBOARDING_PATH) {
    return rolle ? `/dashboard/${rolle}` : null;
  }

  if (pathname.startsWith(DASHBOARD_PREFIX)) {
    if (!rolle) {
      return ONBOARDING_PATH;
    }
    const requiredRolle = dashboardRolleFor(pathname);
    if (requiredRolle && requiredRolle !== rolle) {
      return `/dashboard/${rolle}`;
    }
  }

  return null;
}

/**
 * Verhindert Open-Redirects ueber den ?redirect=-Parameter: nur relative Pfade, die mit genau
 * einem "/" beginnen (kein "//host" und kein eingebettetes "://"), sind ein gueltiges Ziel.
 */
export function isSafeRedirectTarget(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}
