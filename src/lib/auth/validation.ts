import * as z from "zod";

// Verifiziert gegen die installierte zod-Version (4.4.3): z.email() ist in v4 eine eigene
// Top-Level-Funktion statt einer .string().email()-Methode, siehe node_modules/zod/v4/classic/schemas.d.ts.

export const emailSchema = z
  .email("Bitte eine gueltige E-Mail-Adresse eingeben")
  .min(1, "E-Mail wird benoetigt");

// 8 Zeichen ist eine bewusst etwas strengere lokale Untergrenze als Supabase's eigenes,
// im Dashboard konfigurierbares Minimum -- schlaegt client-/serverseitig frueher mit einer
// klaren deutschen Meldung fehl, statt erst bei Supabase mit "weak_password" abgewiesen zu werden.
export const passwordSchema = z
  .string("Passwort wird benoetigt")
  .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein");

export const anzeigenameSchema = z
  .string("Anzeigename wird benoetigt")
  .trim()
  .min(1, "Anzeigename wird benoetigt")
  .max(80, "Der Anzeigename darf hoechstens 80 Zeichen lang sein");

export const registrierenSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const anmeldenSchema = z.object({
  email: emailSchema,
  // Beim Login nur auf Vorhandensein pruefen, nicht auf Laenge -- ob das Passwort stimmt,
  // entscheidet ohnehin Supabase; eine Laengenpruefung wuerde nur alte, kuerzere Passwoerter
  // faelschlich als "ungueltig eingegeben" statt "falsch" melden.
  password: z.string("Passwort wird benoetigt").min(1, "Passwort wird benoetigt"),
});

export const onboardingSchema = z.object({
  rolle: z.enum(["unternehmen", "freelancer"], "Bitte eine Rolle waehlen"),
  anzeigename: anzeigenameSchema,
});

export const onboardingFullSchema = z.object({
  rolle: z.enum(["unternehmen", "freelancer"], "Bitte eine Rolle waehlen"),
  anzeigename: anzeigenameSchema,
  firmenname: z.string().max(120).optional(),
  // Unternehmen
  branche: z.string().optional(),
  unternehmensgroesse: z.string().optional(),
  gesuchte_leistungen: z.array(z.string()).optional(),
  dringlichkeit: z.string().optional(),
  // Freelancer
  spezialisierungen: z.array(z.string()).optional(),
  branchen_erfahrung: z.array(z.string()).optional(),
  erfahrung_jahre: z.string().optional(),
  bio: z.string().max(300, "Die Bio darf hoechstens 300 Zeichen lang sein").optional(),
  verfuegbarkeit: z.string().optional(),
  verfuegbar_ab: z.string().optional(),
});

export const passwortVergessenSchema = z.object({
  email: emailSchema,
});

export const passwortNeuSchema = z.object({
  password: passwordSchema,
});
