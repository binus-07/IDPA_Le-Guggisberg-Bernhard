CREATE TABLE public.projekte (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  unternehmen_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name           TEXT        NOT NULL,
  beschreibung   TEXT,
  leistungen     TEXT[]      NOT NULL DEFAULT '{}',
  budget         TEXT,
  zeitrahmen     TEXT,
  modus          TEXT        NOT NULL,
  erstellt_am    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projekte ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unternehmen sehen eigene Projekte"
  ON public.projekte FOR SELECT
  USING (auth.uid() = unternehmen_id);

CREATE POLICY "Unternehmen erstellen Projekte"
  ON public.projekte FOR INSERT
  WITH CHECK (auth.uid() = unternehmen_id);
