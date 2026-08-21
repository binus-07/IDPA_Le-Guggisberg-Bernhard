import type { Freelancer } from "@/lib/types/freelancer";

const SKILLS_BY_ROLE: Record<string, string[]> = {
  Fotograf: ["Produktfotografie", "Studio-Setup", "Bildbearbeitung", "Lichtsetzung"],
  Fotografin: ["Produktfotografie", "Studio-Setup", "Bildbearbeitung", "Lichtsetzung"],
  Videograf: ["Videoproduktion", "Schnitt", "Storytelling", "Kameraführung"],
  "Content Creator": ["Social Media", "Storytelling", "Video-Editing", "Content-Strategie"],
  "Grafikerin Print": ["Print-Design", "Adobe InDesign", "Typografie", "Branding"],
  "Web Grafikerin": ["Webdesign", "UI Design", "Figma", "Branding"],
};

export function FreelancerSkills({ freelancer }: { freelancer: Freelancer }) {
  const skills = SKILLS_BY_ROLE[freelancer.rolle];

  if (!skills) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-h2-alt text-foreground">Fähigkeiten</h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="border-primary/20 bg-primary/10 text-primary inline-block rounded-full border px-4 py-2 text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
