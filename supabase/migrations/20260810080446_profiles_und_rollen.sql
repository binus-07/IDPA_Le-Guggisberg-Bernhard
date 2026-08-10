-- Phase B: Rollenmodell und Profile.
-- profiles bleibt bewusst schlank (nur Rolle + Anzeigename) -- rollenspezifische Felder
-- (Skills, Portfolio, Firmendaten etc.) kommen erst in Phase C.

create type public.user_role as enum ('unternehmen', 'freelancer', 'admin');
-- 'admin' ist als Wert vorgesehen (z. B. fuer spaetere Moderation), wird in Phase B aber
-- nirgends im UI angeboten oder mit Funktionen hinterlegt.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  rolle public.user_role,
  -- rolle ist bewusst NULLABLE: null = Onboarding noch nicht abgeschlossen. Das ist das
  -- Signal, an dem Proxy und Dashboards erkennen, dass sie auf /onboarding umleiten muessen.
  anzeigename text,
  erstellt_am timestamptz not null default now(),
  aktualisiert_am timestamptz not null default now()
);

comment on table public.profiles is
  'Ein Profil pro Nutzer:in, angelegt automatisch beim Signup. rolle/anzeigename werden erst '
  'beim Onboarding gesetzt.';

-- Trigger: bei jedem neuen auth.users-Eintrag automatisch eine (noch leere) profiles-Zeile
-- anlegen, damit nie ein Profil fehlen kann (kein manuelles "Profil erstellen" noetig).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Trigger: aktualisiert_am bei jedem UPDATE automatisch nachziehen, statt das der
-- Applikationsschicht zu ueberlassen (kann sonst leicht vergessen werden).
create function public.handle_profiles_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.aktualisiert_am = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute function public.handle_profiles_updated_at();

-- Row Level Security: ohne Policy verweigert Postgres per Default jeden Zugriff (auch fuer
-- authenticated). Die drei Policies unten sind die einzigen erlaubten Zugriffswege; es gibt
-- bewusst keine INSERT- oder DELETE-Policy fuer normale Nutzer:innen.
alter table public.profiles enable row level security;

-- Jede authentifizierte Person darf jedes Profil lesen (nicht nur das eigene). Das ist die
-- Grundlage fuer die spaetere Freelancer-Suche (Phase D) -- Profile sind oeffentlich sichtbar
-- innerhalb der eingeloggten Nutzerschaft, aber nicht fuer anonyme Besucher:innen.
create policy "profiles_select_authenticated"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Aktualisieren duerfen Nutzer:innen ausschliesslich ihr eigenes Profil (Rollenwahl beim
-- Onboarding, spaeter z. B. Anzeigename aendern).
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Bewusst KEINE INSERT-Policy: Zeilen entstehen ausschliesslich ueber den security-definer-
-- Trigger handle_new_user(). Ohne diese Einschraenkung koennten Nutzer:innen sonst beliebige
-- Profile mit fremder id anlegen, bevor der eigentliche auth.users-Eintrag existiert.
--
-- Bewusst KEINE DELETE-Policy: Profile werden ueber die FK "on delete cascade" automatisch
-- entfernt, wenn der zugehoerige auth.users-Eintrag geloescht wird -- ein direktes Loeschen
-- durch Nutzer:innen ist in Phase B nicht vorgesehen.
--
-- Fuer anonyme Nutzer:innen ("anon"-Rolle) existiert keine einzige Policy -> kein Zugriff,
-- weder lesend noch schreibend.

-- RLS-Policies erlauben nur, WELCHE Zeilen sichtbar/aenderbar sind -- ohne die passenden
-- Tabellen-Grants darf die Rolle "authenticated" gar nicht erst SELECT/UPDATE versuchen
-- (Postgres verlangt beides). Bewusst kein INSERT/DELETE-Grant, damit selbst ein Fehler in
-- den Policies oben nicht versehentlich Schreibzugriff auf fremde Zeilen eroeffnet.
grant select, update on public.profiles to authenticated;
