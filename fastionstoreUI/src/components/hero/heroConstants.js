/**
 * ============================================================================
 * Hero Constants & Color Utilities
 * ============================================================================
 * Editorial streetwear slides archive, canonical color palettes,
 * and hex resolution functions used across the Hero bento grid.
 * ============================================================================
 */

export const heroSlides = [
  {
    number: "01",
    image: "/models/model1.png",
    badge: "DROP 04 - 2026",
    tag: "OVERSIZED FIT",
    title: "Heavyweight Boxy Streetwear.",
    specHeadline: "Clear Silhouettes",
    specDetail:
      "280 GSM combed organic cotton with relaxed drop-shoulder cut and anti-fade reactive dye.",
    primaryCta: "Explore Drop 04",
    primaryLink: "/new-arrivals",
    accentBadge: "100% Supima Cotton",
    stats: "280 GSM • Heavy Combed",
  },
  {
    number: "02",
    image: "/models/model3.png",
    badge: "NEW SEASON",
    tag: "TECHNICAL FLEECE",
    title: "Urban Relaxed T-shirt",
    specHeadline: "Weatherproof Weave",
    specDetail:
      "Architectural drape with double-needle ribbed hems and ultra-comfortable brushed interior fleece.",
    primaryCta: "Explore Hoodies",
    primaryLink: "/collections/hoodies",
    accentBadge: "Thermal Fleece",
    stats: "380 GSM • Brushed Interior",
  },
  {
    number: "03",
    image: "/models/model2.png",
    badge: "LIMITED RELEASE",
    tag: "STREET ESSENTIALS",
    title: "Tactical Minimal Daily Rotation.",
    specHeadline: "Pre-Shrunk Silhouette",
    specDetail:
      "Engineered boxy cuts that hold their shape through 50+ wash cycles without losing collar structure.",
    primaryCta: "Shop Essentials",
    primaryLink: "/collections/oversized-tees",
    accentBadge: "Signature Cut",
    stats: "Raw Finish • Acid Wash",
  },
];

export const STREET_COLOR_MAP = {
  black: "#111111",
  white: "#FFFFFF",
  gray: "#6B7280",
  grey: "#6B7280",
  charcoal: "#374151",
  slate: "#475569",
  beige: "#D4B996",
  khaki: "#C3B091",
  cream: "#FFFDD0",
  sand: "#E5D3B3",
  olive: "#4D7C0F",
  green: "#22C55E",
  sage: "#8A9A86",
  blue: "#2563EB",
  navy: "#1E3A8A",
  cobalt: "#1D4ED8",
  red: "#e34234",
  crimson: "#e34234",
  cinnabar: "#e34234",
  maroon: "#881337",
  orange: "#e34234",
  rust: "#C2410C",
  yellow: "#EAB308",
  mustard: "#D97706",
  amber: "#F59E0B",
  lime: "#d4ff3f",
  volt: "#d4ff3f",
  acid: "#d4ff3f",
  pink: "#EC4899",
  purple: "#cbb3eb",
  lilac: "#cbb3eb",
  lavender: "#cbb3eb",
  brown: "#92400E",
  tan: "#D2B48C",
  mocha: "#78350F",
};

export const CANONICAL_PALETTES = [
  {
    key: "black",
    name: "Black",
    hex: "#111111",
    keywords: ["black", "noir", "dark", "jet", "pitch"],
  },
  {
    key: "white",
    name: "White",
    hex: "#FFFFFF",
    keywords: ["white", "ivory", "snow", "swanwhite"],
  },
  {
    key: "blue",
    name: "Blue",
    hex: "#2563EB",
    keywords: ["blue", "navy", "cobalt", "cyan", "teal", "indigo", "sky", "denim"],
  },
  {
    key: "red",
    name: "Red",
    hex: "#EF4444",
    keywords: ["red", "crimson", "wine", "maroon", "burgundy", "ruby", "scarlet", "cherry"],
  },
  {
    key: "brown",
    name: "Brown",
    hex: "#78350F",
    keywords: ["brown", "coffee", "mocha", "chocolate", "espresso", "cocoa"],
  },
  {
    key: "green",
    name: "Green",
    hex: "#4D7C0F",
    keywords: ["green", "olive", "sage", "forest", "emerald", "lime", "mint"],
  },
  {
    key: "grey",
    name: "Grey",
    hex: "#6B7280",
    keywords: ["grey", "gray", "charcoal", "slate", "ash", "silver"],
  },
  {
    key: "beige",
    name: "Beige",
    hex: "#D4B996",
    keywords: ["beige", "cream", "khaki", "sand", "tan", "nude", "wheat"],
  },
  {
    key: "orange",
    name: "Orange",
    hex: "#F97316",
    keywords: ["orange", "rust", "tangerine", "peach", "coral"],
  },
  {
    key: "purple",
    name: "Purple",
    hex: "#A855F7",
    keywords: ["purple", "lavender", "violet", "lilac", "plum"],
  },
  {
    key: "yellow",
    name: "Yellow",
    hex: "#EAB308",
    keywords: ["yellow", "mustard", "amber", "gold"],
  },
  {
    key: "pink",
    name: "Pink",
    hex: "#EC4899",
    keywords: ["pink", "rose", "fuchsia", "magenta"],
  },
];

/**
 * Resolves any raw color string (e.g. "Charcoal Grey") to a canonical hex color code
 */
export const resolveColorHex = (colorString) => {
  if (!colorString) return "#111111";
  const str = String(colorString).trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str)) return str;
  if (STREET_COLOR_MAP[str]) return STREET_COLOR_MAP[str];
  for (const [key, hex] of Object.entries(STREET_COLOR_MAP)) {
    if (str.includes(key)) return hex;
  }
  const hues = [
    "#2563EB",
    "#F97316",
    "#84CC16",
    "#EF4444",
    "#4D7C0F",
    "#A855F7",
    "#D4B996",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return hues[Math.abs(hash) % hues.length];
};

/**
 * Matches a color string to its corresponding canonical palette object
 */
export const canonicalizeColor = (colorString) => {
  if (!colorString) return null;
  const str = String(colorString).trim().toLowerCase();
  for (const pal of CANONICAL_PALETTES) {
    if (pal.key === str || pal.keywords.some((kw) => str.includes(kw))) {
      return pal;
    }
  }
  return null;
};

export const defaultPopularColors = [
  { name: "Black", hex: "#111111", filter: "black", count: 18 },
  { name: "Cinnabar", hex: "#e34234", filter: "red", count: 12 },
  { name: "Volt Lime", hex: "#d4ff3f", filter: "lime", count: 8 },
  { name: "Lilac", hex: "#cbb3eb", filter: "purple", count: 7 },
  { name: "White", hex: "#FFFFFF", filter: "white", count: 11 },
  { name: "Charcoal", hex: "#374151", filter: "grey", count: 9 },
  { name: "Beige", hex: "#D4B996", filter: "beige", count: 6 },
  { name: "Cobalt", hex: "#2563EB", filter: "blue", count: 5 },
];
