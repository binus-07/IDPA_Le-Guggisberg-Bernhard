-- ─── Freelancer: ausfuehrliche Beschreibung (Detailseite) ─────────────────────
-- Die Seed-CSV (data/Freelancer_Datenbank_Freelancer.csv) enthaelt neben "Kurzbeschreibung"
-- (bereits als freelancer.kurzbeschreibung importiert, siehe 20260820130000) auch eine Spalte
-- "Ausführliche Beschreibung" -- bisher ungenutzt, weil dafuer keine Spalte existierte. Analog zu
-- profiles.bio (siehe 20260813120000_onboarding_felder.sql) fuer echte Nutzer:innen, aber auf der
-- freelancer-Katalogtabelle, da es dort (noch) keine Verknuepfung zu profiles/auth.users gibt.
ALTER TABLE public.freelancer ADD COLUMN bio TEXT;
