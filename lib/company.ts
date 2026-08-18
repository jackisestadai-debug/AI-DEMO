// Single source of truth for the legal/contact info required on a Swedish
// e-commerce site (e-handelslagen: säljarens namn, org.nr och kontaktuppgifter
// måste synas). Fill in the real values once the enskild firma's uppgifter
// are at hand — everything referencing this file (footer, /kontakt,
// /angerratt, /integritetspolicy) updates automatically.
export const company = {
  legalName: "[Fyll i firmans registrerade namn]",
  orgNumber: "[Fyll i organisationsnummer]",
  email: "hej@nattro.se",
  address: "[Fyll i adress]",
  brand: "Nattro",
};
