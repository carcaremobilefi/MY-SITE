/**
 * Travel-zone pricing by Finnish postal code (first 2 digits).
 * Source of truth — used both in the booking flow and on marketing pages.
 */
export type Zone = {
  id: "core" | "metro" | "extended" | "outside";
  fee: number; // EUR
  label: { en: string; fi: string; sv: string };
  desc: { en: string; fi: string; sv: string };
};

const ZONES: Record<Zone["id"], Zone> = {
  core: {
    id: "core",
    fee: 0,
    label: { en: "Helsinki core", fi: "Helsinki keskusta", sv: "Helsingfors centrum" },
    desc: { en: "Helsinki postal codes 00100–00990", fi: "Helsingin postinumerot 00100–00990", sv: "Helsingfors postnummer 00100–00990" },
  },
  metro: {
    id: "metro",
    fee: 0,
    label: { en: "Espoo · Vantaa", fi: "Espoo · Vantaa", sv: "Esbo · Vanda" },
    desc: { en: "Espoo (02xxx) & Vantaa (01xxx) — no travel fee", fi: "Espoo (02xxx) & Vantaa (01xxx) — ei matkamaksua", sv: "Esbo (02xxx) & Vanda (01xxx) — ingen reseavgift" },
  },
  extended: {
    id: "extended",
    fee: 19,
    label: { en: "Greater capital region", fi: "Laajempi pääkaupunkiseutu", sv: "Större huvudstadsregionen" },
    desc: { en: "Kauniainen, Kirkkonummi, Sipoo, Kerava, Tuusula, Järvenpää, Nurmijärvi", fi: "Kauniainen, Kirkkonummi, Sipoo, Kerava, Tuusula, Järvenpää, Nurmijärvi", sv: "Grankulla, Kyrkslätt, Sibbo, Kervo, Tusby, Träskända, Nurmijärvi" },
  },
  outside: {
    id: "outside",
    fee: 39,
    label: { en: "Beyond capital region", fi: "Pääkaupunkiseudun ulkopuolella", sv: "Utanför huvudstadsregionen" },
    desc: { en: "Confirmed individually — fee may vary by distance", fi: "Vahvistetaan tapauskohtaisesti — maksu voi vaihdella", sv: "Bekräftas individuellt — avgiften kan variera beroende på avstånd" },
  },
};

export const ZONE_LIST: Zone[] = [ZONES.core, ZONES.metro, ZONES.extended, ZONES.outside];

/** Resolve travel zone from a Finnish postal code. */
export function zoneFromPostal(postal: string): Zone {
  const digits = postal.replace(/\D/g, "").slice(0, 5);
  if (digits.length < 2) return ZONES.core;
  const p = parseInt(digits.slice(0, 2), 10);

  // 00 = Helsinki
  if (digits.startsWith("00")) return ZONES.core;
  // 01 = Vantaa, 02 = Espoo/Kauniainen
  if (p === 1 || p === 2) return ZONES.metro;
  // 03–09 = surrounding Uusimaa towns reachable < ~45 min
  if (p >= 3 && p <= 9) return ZONES.extended;
  return ZONES.outside;
}
