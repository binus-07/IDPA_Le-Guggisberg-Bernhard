import type { AuthError } from "@supabase/supabase-js";

// Codes verifiziert gegen node_modules/@supabase/auth-js/dist/main/lib/error-codes.d.ts
// (installierte Version 2.112.2). Nur die fuer Registrierung/Login/Passwort-Reset relevante
// Teilmenge ist uebersetzt; alles andere faellt auf eine generische, aber ehrliche Meldung
// zurueck -- nie der rohe englische Supabase-String im UI.
const MESSAGES: Partial<Record<string, string>> = {
  invalid_credentials: "E-Mail-Adresse oder Passwort ist falsch.",
  email_exists: "Für diese E-Mail-Adresse existiert bereits ein Konto.",
  user_already_exists: "Für diese E-Mail-Adresse existiert bereits ein Konto.",
  weak_password: "Das Passwort ist zu schwach. Bitte ein stärkeres Passwort wählen.",
  email_not_confirmed:
    "Bitte bestätige zuerst deine E-Mail-Adresse über den Link, den wir dir geschickt haben.",
  email_address_invalid: "Diese E-Mail-Adresse ist nicht gültig.",
  user_not_found: "Es wurde kein Konto mit dieser E-Mail-Adresse gefunden.",
  same_password: "Das neue Passwort muss sich vom bisherigen unterscheiden.",
  over_email_send_rate_limit:
    "Zu viele Versuche. Bitte warte einen Moment, bevor du es erneut versuchst.",
  over_request_rate_limit: "Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.",
  session_expired: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
  refresh_token_not_found: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
  refresh_token_already_used: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
  signup_disabled: "Die Registrierung ist derzeit deaktiviert.",
  captcha_failed: "Sicherheitsprüfung fehlgeschlagen. Bitte versuche es erneut.",
  validation_failed: "Die Eingaben konnten nicht verarbeitet werden. Bitte prüfe deine Angaben.",
};

const FALLBACK_MESSAGE = "Etwas ist schiefgelaufen. Bitte versuche es später erneut.";

export function translateAuthError(error: Pick<AuthError, "code"> | null | undefined): string {
  if (!error?.code) {
    return FALLBACK_MESSAGE;
  }
  return MESSAGES[error.code] ?? FALLBACK_MESSAGE;
}
