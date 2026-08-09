export interface Product {
  slug: string;
  name: string;
  price: number; // SEK
  compareAtPrice?: number;
  description: string;
  emoji: string;
  accent: string; // tailwind gradient classes, must stay literal for the JIT scanner
}

// Starter catalog for the "sömn/wellness"-nischen. Placeholder emoji artwork —
// swap for real product photos once specific SKUs are sourced from a supplier
// (CJdropshipping / Syncee, EU-lager för snabb leverans till Sverige).
export const products: Product[] = [
  {
    slug: "viktad-filt",
    name: "Viktad Filt 7kg",
    price: 899,
    compareAtPrice: 1299,
    description:
      "Tyngdfilt som simulerar en varm kram och hjälper kroppen att slappna av snabbare. För dig som har svårt att somna eller vaknar ofta under natten.",
    emoji: "🛏️",
    accent: "from-indigo-500 to-purple-600",
  },
  {
    slug: "sovmask-3d",
    name: "3D Sovmask med Öronproppar",
    price: 249,
    compareAtPrice: 399,
    description:
      "Konturformad sovmask som inte trycker mot ögonen, med mjuka öronproppar för total mörker och tystnad.",
    emoji: "😴",
    accent: "from-slate-600 to-slate-800",
  },
  {
    slug: "blaljusglasogon",
    name: "Blåljusglasögon",
    price: 349,
    compareAtPrice: 549,
    description:
      "Blockerar blått ljus från skärmar på kvällen så din kropp producerar melatonin som vanligt och du somnar lättare.",
    emoji: "🕶️",
    accent: "from-amber-500 to-orange-600",
  },
  {
    slug: "vitt-brus-maskin",
    name: "Vitt Brus-maskin",
    price: 449,
    compareAtPrice: 649,
    description:
      "20 lugnande ljud — regn, hav, brus — som maskerar störande omgivningsljud och hjälper hjärnan att koppla av.",
    emoji: "🌊",
    accent: "from-sky-500 to-cyan-600",
  },
  {
    slug: "kylande-kudde",
    name: "Kylande Gelkudde",
    price: 599,
    compareAtPrice: 899,
    description:
      "Temperaturreglerande gelinsats som håller huvudkudden sval hela natten. Perfekt för dig som blir varm och vaknar av det.",
    emoji: "❄️",
    accent: "from-teal-500 to-emerald-600",
  },
  {
    slug: "magnesium-spray",
    name: "Magnesium Sömnspray",
    price: 199,
    compareAtPrice: 299,
    description:
      "Sprayas direkt på huden innan läggdags. Magnesium hjälper musklerna slappna av och lugnar nervsystemet.",
    emoji: "🧴",
    accent: "from-fuchsia-500 to-pink-600",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
