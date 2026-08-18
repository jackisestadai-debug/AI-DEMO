export interface Product {
  slug: string;
  name: string;
  price: number; // SEK, customer-facing
  compareAtPrice?: number;
  description: string;
  emoji: string;
  accent: string; // tailwind gradient classes, must stay literal for the JIT scanner
  /** Internal only — never render this. Rough leverantörskostnad (CJdropshipping/Syncee) for margin planning. */
  costPriceSek: [number, number];
  /**
   * CJdropshipping variant id (vid) for the exact sourced SKU. Required for
   * automatisk orderpush — without it, paid orders for this product land in
   * status "awaiting_supplier_mapping" and must be placed on CJ manually.
   * Fill in once a real product has been picked from CJ's EU-warehouse catalog.
   */
  cjVariantId?: string;
}

// Startkatalog för nischen sömn/wellness — sex produkttyper valda för att de är
// verifierat efterfrågade dropshipping-produkter 2026 (viktade filtar, sovmasker,
// vitt brus-maskiner, magnesiumspray) med sund marginal (leverantörskostnad
// ~30-50% av försäljningspris). Namn/priser/specs är realistiska utgångslägen —
// byt till exakta SKU:er + riktiga produktfoton när ett leverantörskonto
// (CJdropshipping / Syncee, EU-lager för snabb leverans till Sverige) är valt.
export const products: Product[] = [
  {
    slug: "viktad-filt",
    name: "Nattro Viktad Filt 6 kg (150×200 cm)",
    price: 799,
    compareAtPrice: 1199,
    description:
      "Tyngdfilt fylld med glaspärlor som simulerar en varm kram och hjälper kroppen slappna av snabbare. 150×200 cm, andningsbart bomullstyg. För dig som har svårt att somna eller vaknar ofta under natten.",
    emoji: "🛏️",
    accent: "from-indigo-500 to-purple-600",
    costPriceSek: [250, 320],
  },
  {
    slug: "sovmask-3d",
    name: "Nattro 3D Sovmask med Minnesskum",
    price: 249,
    compareAtPrice: 399,
    description:
      "Konturformad sovmask i minnesskum som inte trycker mot ögonen, med löstagbara mjuka öronproppar för total mörker och tystnad. Justerbart bandspänne.",
    emoji: "😴",
    accent: "from-slate-600 to-slate-800",
    costPriceSek: [60, 90],
  },
  {
    slug: "blaljusglasogon",
    name: "Nattro Blåljusglasögon",
    price: 349,
    compareAtPrice: 549,
    description:
      "Blockerar blått ljus från skärmar på kvällen så kroppen producerar melatonin som vanligt. Lätt bågform, klar lins (ingen orange tint) för normalt dagsbruk också.",
    emoji: "🕶️",
    accent: "from-amber-500 to-orange-600",
    costPriceSek: [70, 110],
  },
  {
    slug: "vitt-brus-maskin",
    name: "Nattro Vitt Brus-maskin",
    price: 449,
    compareAtPrice: 649,
    description:
      "24 ljud — regn, hav, brus, hjärtslag — med timer och nattlampa. Maskerar störande omgivningsljud och hjälper hjärnan koppla av. USB-laddningsbar.",
    emoji: "🌊",
    accent: "from-sky-500 to-cyan-600",
    costPriceSek: [130, 190],
  },
  {
    slug: "kylande-kudde",
    name: "Nattro Kylande Gelkudde-insats",
    price: 599,
    compareAtPrice: 899,
    description:
      "Temperaturreglerande gelinsats (40×60 cm) som läggs i din vanliga örngott och håller kudden sval hela natten. Perfekt för dig som blir varm och vaknar av det.",
    emoji: "❄️",
    accent: "from-teal-500 to-emerald-600",
    costPriceSek: [160, 220],
  },
  {
    slug: "magnesium-spray",
    name: "Nattro Magnesium Sömnspray 100 ml",
    price: 199,
    compareAtPrice: 299,
    description:
      "Magnesiumklorid-spray som sprayas direkt på huden innan läggdags. Hjälper musklerna slappna av och lugnar nervsystemet. Räcker ca 6-8 veckor.",
    emoji: "🧴",
    accent: "from-fuchsia-500 to-pink-600",
    costPriceSek: [45, 75],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
