export interface BisherigesProjekt {
  titel: string;
  beschreibung: string;
  kommentar: string;
  datum: string;
  bewertung: number;
}

export interface Freelancer {
  id: string;
  name: string;
  rolle: string;
  /** Undefiniert bei Freelancern, die nur auf der Home-Seite unter "Top Freelancer" stehen. */
  seitJahren?: number;
  /** Kartentext von Screen 2 -- bei manchen Freelancern im Mockup mitten im Satz abgeschnitten. */
  beschreibung?: string;
  /** Voller Fliesstext von Screen 3 -- nur bei Thomas Wenger vorhanden. */
  bio?: string;
  bisherigeProjekte?: BisherigesProjekt[];
  /** Steuert das Stern-Abzeichen (Screen 2 Karte 1, alle Top-Freelancer auf Screen 1). */
  empfohlen: boolean;
}
