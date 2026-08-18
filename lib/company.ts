// Single source of truth for the legal/contact info required on a Swedish
// e-commerce site (e-handelslagen: säljarens namn, org.nr och kontaktuppgifter
// måste synas). Fill in the real values once the enskild firma's uppgifter
// are at hand — everything referencing this file (footer, /kontakt,
// /angerratt, /integritetspolicy) updates automatically.
export const company = {
  legalName: "Jack Isestad",
  // Kept out of git history (env var, not a literal) since a personnummer-
  // baserat org.nr är känsligare att ha permanent i repot — visas ändå
  // publikt på sajten, det är ju lagkravet, men slipper ligga kvar i
  // commit-historiken. Sätt NEXT_PUBLIC_COMPANY_ORG_NUMBER i .env.local
  // (lokalt) och i Vercels miljövariabler (produktion).
  orgNumber: process.env.NEXT_PUBLIC_COMPANY_ORG_NUMBER || "[Fyll i organisationsnummer]",
  email: "hej@nattro.se",
  address: "Ymers väg 6, 148 33 Ösmo",
  brand: "Nattro",
};
