export interface Teilaufgabe {
  titel: string;
  fortschrittProzent: number;
  freelancerName?: string;
  freelancerRolle?: string;
  betragChf?: number;
  frist?: string;
  letzteNachricht?: string;
}

export interface Projekt {
  id: string;
  titel: string;
  auftragsbeschreibung: string;
  teilaufgaben: Teilaufgabe[];
}
