-- Phase C: Rollenspezifische Onboarding-Felder.
-- Alle Spalten sind nullable -- sie werden erst beim Onboarding gesetzt, nicht beim Signup.

alter table public.profiles
  -- Gemeinsam (beide Rollen koennen einen Firmennamen haben)
  add column if not exists firmenname            text,

  -- Unternehmen-spezifisch
  add column if not exists branche               text,
  add column if not exists unternehmensgroesse   text,
  add column if not exists gesuchte_leistungen   text[],
  add column if not exists dringlichkeit         text,

  -- Freelancer-spezifisch
  add column if not exists spezialisierungen     text[],
  add column if not exists branchen_erfahrung    text[],
  add column if not exists erfahrung_jahre       text,
  add column if not exists bio                   text        check (char_length(bio) <= 300),
  add column if not exists verfuegbarkeit        text,
  add column if not exists verfuegbar_ab         date;
