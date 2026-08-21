-- ─── Freelancer-Datenbank ─────────────────────────────────────────────────────

create table if not exists public.freelancer (
  freelancer_id   text primary key,
  nachname        text not null,
  vorname         text not null,
  rolle           text not null,
  jahre_taetig    integer,
  bezahlung_chf   numeric(10, 2),
  kurzbeschreibung text
);

-- ─── Projekte pro Freelancer (Rohdaten für Bewertungen) ───────────────────────

create table if not exists public.freelancer_projekte (
  id              bigint generated always as identity primary key,
  freelancer_id   text not null references public.freelancer(freelancer_id) on delete cascade,
  titel           text,
  bewertung       numeric(3, 1) check (bewertung >= 1 and bewertung <= 5),
  beschreibung    text
);

create index if not exists idx_freelancer_projekte_freelancer_id
  on public.freelancer_projekte(freelancer_id);

-- ─── Marketing-Aktivitäten ────────────────────────────────────────────────────

create table if not exists public.marketing_aktivitaeten (
  id              bigint generated always as identity primary key,
  rolle           text not null,
  kategorie       text,
  aktivitaet      text not null,
  beschreibung    text
);

create index if not exists idx_marketing_aktivitaeten_rolle
  on public.marketing_aktivitaeten(rolle);

-- ─── RLS: öffentlich lesbar (Verzeichnis-Daten) ──────────────────────────────

alter table public.freelancer            enable row level security;
alter table public.freelancer_projekte   enable row level security;
alter table public.marketing_aktivitaeten enable row level security;

create policy "public read freelancer"
  on public.freelancer for select using (true);

create policy "public read freelancer_projekte"
  on public.freelancer_projekte for select using (true);

create policy "public read marketing_aktivitaeten"
  on public.marketing_aktivitaeten for select using (true);

-- ─── Grants für service_role (Seed-Script / Backend) ─────────────────────────

grant all on public.freelancer              to service_role;
grant all on public.freelancer_projekte     to service_role;
grant all on public.marketing_aktivitaeten  to service_role;
grant all on sequence public.freelancer_projekte_id_seq    to service_role;
grant all on sequence public.marketing_aktivitaeten_id_seq to service_role;
