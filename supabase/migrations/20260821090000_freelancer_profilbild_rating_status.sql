-- ─── Freelancer: Profilbild, Bewertung, Status ────────────────────────────────

ALTER TABLE public.freelancer ADD COLUMN profile_image_url TEXT;
ALTER TABLE public.freelancer ADD COLUMN rating NUMERIC(3, 1) CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE public.freelancer ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

-- Einmalige Rueckberechnung aus den bereits vorhandenen Projektbewertungen, damit bestehende
-- Zeilen nicht mit rating = NULL dastehen. Kuenftige Bewertungen werden hier bewusst NICHT
-- automatisch nachgezogen (kein Trigger) -- das waere ein eigener Architekturentscheid.
UPDATE public.freelancer AS f
SET rating = avg_rating.wert
FROM (
  SELECT freelancer_id, ROUND(AVG(bewertung), 1) AS wert
  FROM public.freelancer_projekte
  WHERE bewertung IS NOT NULL
  GROUP BY freelancer_id
) AS avg_rating
WHERE f.freelancer_id = avg_rating.freelancer_id;

-- Bisherige "public read"-Policy erlaubte jede Zeile; jetzt nur noch aktive Freelancer, siehe
-- neue status-Spalte oben.
DROP POLICY IF EXISTS "public read freelancer" ON public.freelancer;

CREATE POLICY "public read active freelancer"
  ON public.freelancer FOR SELECT
  USING (status = 'active');

-- ─── Storage: Profilbilder ─────────────────────────────────────────────────────
-- Oeffentlich lesbarer Bucket fuer Freelancer-Profilbilder. Es gibt aktuell keine Verknuepfung
-- zwischen public.freelancer (per CSV/Skript befuellte Katalogtabelle, siehe
-- scripts/seed-freelancer.ts) und auth.users -- eine "nur eigenes Bild hochladen"-Policy braucht
-- deshalb zuerst eine Ownership-Spalte (z. B. user_id) und einen Claim-Flow, die es hier noch
-- nicht gibt. Nur Lesen ist deshalb vorerst erlaubt; Upload bleibt Service-Role vorbehalten.
INSERT INTO storage.buckets (id, name, public)
VALUES ('freelancer-profiles', 'freelancer-profiles', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read freelancer profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'freelancer-profiles');
