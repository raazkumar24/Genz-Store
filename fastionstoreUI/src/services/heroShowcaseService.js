/**
 * Master Hero & Homepage Configuration Service
 * Controls all Hero bento grid components:
 * 1. Main Hero Editorial Slides
 * 2. Right Bento Spotlight Card (Oversized Boxy Showcase)
 * 3. Right Bento Tactical Drop Card
 * 4. Archived Catalog Lifestyle Lookbook Carousel (Matches Streetwear Drops UI)
 */

const SPOTLIGHT_STORAGE_KEY = "genz_hero_spotlight_config";
const MASTER_STORAGE_KEY = "genz_hero_master_config";

export const DEFAULT_HERO_SLIDES = [
  {
    id: "slide-1",
    number: "01",
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
    image: "/models/model1.png",
  },
  {
    id: "slide-2",
    number: "02",
    badge: "NEW SEASON",
    tag: "TECHNICAL FLEECE",
    title: "Urban Relaxed Hoodies & Cargos.",
    specHeadline: "Weatherproof Weave",
    specDetail:
      "Architectural drape with double-needle ribbed hems and ultra-comfortable brushed interior fleece.",
    primaryCta: "Explore Hoodies",
    primaryLink: "/collections/hoodies",
    accentBadge: "Thermal Fleece",
    stats: "380 GSM • Brushed Interior",
    image: "/models/model3.png",
  },
  {
    id: "slide-3",
    number: "03",
    badge: "LIMITED RELEASE",
    tag: "STREET ESSENTIALS",
    title: "Tactical Minimal Daily Rotation.",
    specHeadline: "Pre-Shrunk Silhouette",
    specDetail:
      "Pre-shrunk custom milled tactical jersey built for daily rotation across any weather.",
    primaryCta: "Shop Essentials",
    primaryLink: "/collections/oversized-tees",
    accentBadge: "Custom Cut",
    stats: "320 GSM • Anti-Fade Dye",
    image: "/models/model2.png",
  },
];

export const DEFAULT_HERO_SPOTLIGHT = {
  productId: "",
  targetCategory: "hoodie",
  badgeText: "HEAVYWEIGHT 380 GSM",
  title: "TAGAS HOODIE FOR MEN SWEATSHIRT",
  subtitle: "Drop shoulder & double-needle ribbed hem.",
  tagPill: "SIGNATURE FIT",
  customPrice: "549",
  customImage: "",
  cardTheme: "dark",
};

export const DEFAULT_TACTICAL_DROP = {
  tag: "TRENDING BOTTOMWEAR",
  title: "SAMFOR PARACHUTE CARGO",
  subtitle: "Raw Ecru • Multi-Pocket Baggy Fit",
  image: "/collections/baggy_pants.png",
  link: "/collections/cargos",
  price: "479",
  originalPrice: "799",
};

export const DEFAULT_ARCHIVED_CATALOG = {
  campaignTag: "02 - CURATED CAMPAIGN LOOKBOOK",
  sectionTitle: "THIS SEASON'S",
  sectionSubtitle: "winter drops",
  seeAllText: "VIEW COMPLETE ARCHIVE (09)",
  seeAllLink: "/new-arrivals",
  cards: [
    {
      id: "card-1",
      badgeLeft: "LOOK 01 • MONOCHROME SET",
      badgeRight: "2 ITEMS IN LOOK",
      title: "SIMPLE CASUAL HEAVY FLEECE",
      subtitle: "Hand-picked monochrome winter silhouettes for effortless studio layering.",
      buttonText: "SHOP THIS LOOK",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
      link: "/collections/oversized-tees",
    },
    {
      id: "card-2",
      badgeLeft: "LOOK 02 • FLUID DRAPE",
      badgeRight: "3 ITEMS IN LOOK",
      title: "WEEKEND HANGOUT EDIT",
      subtitle: "Relaxed breathable silhouettes engineered for all-day movement.",
      buttonText: "SHOP THIS LOOK",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
      link: "/new-arrivals",
    },
    {
      id: "card-3",
      badgeLeft: "LOOK 03 • STUDIO",
      badgeRight: "LIMITED DROP",
      title: "COZY ANYWHERE PLEATS",
      subtitle: "Tailored wide-leg architecture meets streetwear comfort.",
      buttonText: "SHOP THIS LOOK",
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85",
      link: "/collections/hoodies",
    },
  ],
};

export const DEFAULT_MASTER_CONFIG = {
  slides: DEFAULT_HERO_SLIDES,
  spotlight: DEFAULT_HERO_SPOTLIGHT,
  tactical: DEFAULT_TACTICAL_DROP,
  archivedCatalog: DEFAULT_ARCHIVED_CATALOG,
};

/**
 * Retrieve master homepage & hero configuration
 */
export const getHeroMasterConfig = () => {
  try {
    const raw = localStorage.getItem(MASTER_STORAGE_KEY);
    if (!raw) {
      // Check legacy spotlight config
      const legacySpotlight = localStorage.getItem(SPOTLIGHT_STORAGE_KEY);
      if (legacySpotlight) {
        try {
          return {
            ...DEFAULT_MASTER_CONFIG,
            spotlight: {
              ...DEFAULT_HERO_SPOTLIGHT,
              ...JSON.parse(legacySpotlight),
            },
          };
        } catch {}
      }
      return DEFAULT_MASTER_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      slides: Array.isArray(parsed.slides) ? parsed.slides : DEFAULT_HERO_SLIDES,
      spotlight: { ...DEFAULT_HERO_SPOTLIGHT, ...(parsed.spotlight || {}) },
      tactical: { ...DEFAULT_TACTICAL_DROP, ...(parsed.tactical || {}) },
      archivedCatalog: {
        ...DEFAULT_ARCHIVED_CATALOG,
        ...(parsed.archivedCatalog || {}),
        cards:
          Array.isArray(parsed.archivedCatalog?.cards) &&
          parsed.archivedCatalog.cards.length > 0
            ? parsed.archivedCatalog.cards
            : DEFAULT_ARCHIVED_CATALOG.cards,
      },
    };
  } catch (e) {
    console.error("Error reading hero master config:", e);
    return DEFAULT_MASTER_CONFIG;
  }
};

/**
 * Save master configuration and trigger live updates across the storefront
 */
export const saveHeroMasterConfig = (config) => {
  try {
    const current = getHeroMasterConfig();
    const merged = {
      slides: config.slides || current.slides,
      spotlight: { ...current.spotlight, ...(config.spotlight || {}) },
      tactical: { ...current.tactical, ...(config.tactical || {}) },
      archivedCatalog: {
        ...current.archivedCatalog,
        ...(config.archivedCatalog || {}),
      },
    };

    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(
      SPOTLIGHT_STORAGE_KEY,
      JSON.stringify(merged.spotlight)
    );

    window.dispatchEvent(
      new CustomEvent("heroConfigUpdated", { detail: merged })
    );
    window.dispatchEvent(
      new CustomEvent("heroSpotlightUpdated", { detail: merged.spotlight })
    );
    return true;
  } catch (e) {
    console.error("Error saving hero master config:", e);
    return false;
  }
};

/**
 * Reset all Hero configurations to pristine defaults
 */
export const resetHeroMasterConfig = () => {
  try {
    localStorage.removeItem(MASTER_STORAGE_KEY);
    localStorage.removeItem(SPOTLIGHT_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("heroConfigUpdated", { detail: DEFAULT_MASTER_CONFIG })
    );
    window.dispatchEvent(
      new CustomEvent("heroSpotlightUpdated", {
        detail: DEFAULT_HERO_SPOTLIGHT,
      })
    );
    return true;
  } catch (e) {
    console.error("Error resetting hero master config:", e);
    return false;
  }
};

// Legacy exports for backwards compatibility
export const getHeroSpotlightConfig = () => {
  return getHeroMasterConfig().spotlight;
};

export const saveHeroSpotlightConfig = (config) => {
  const master = getHeroMasterConfig();
  return saveHeroMasterConfig({ ...master, spotlight: config });
};

export const resetHeroSpotlightConfig = () => {
  return resetHeroMasterConfig();
};
