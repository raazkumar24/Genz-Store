import axios from 'axios';
import { API_URL } from './api';

/**
 * Master Hero & Homepage Configuration Service
 * Controls all Hero bento grid components:
 * 1. Main Hero Editorial Slides (Left 8-col slider)
 * 2. Right Bento Spotlight Card (Oversized Boxy Showcase)
 * 3. Right Bento Tactical Drop Card
 * 4. Archived Catalog Lifestyle Lookbook Carousel (Matches Streetwear Drops UI)
 */

const SPOTLIGHT_STORAGE_KEY = "genz_hero_spotlight_config";
const MASTER_STORAGE_KEY = "genz_hero_master_config";
export const HERO_CHANNEL_NAME = "genz_hero_channel";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

export const formatHeroImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads')) {
    const base = API_URL.replace(/\/api$/, '');
    return `${base}${url}`;
  }
  return url;
};

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
  tag: "TRENDING CARGO",
  badgeText: "HEAVYWEIGHT 280 GSM",
  title: "SAMFOR PARACHUTE CARGO",
  subtitle: "Raw Ecru • Relaxed Fit",
  brand: "GENZ ARCHIVE",
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
 * Sanitizes and fills any missing fields with defaults
 */
const sanitizeConfig = (raw) => {
  if (!raw || typeof raw !== 'object') return DEFAULT_MASTER_CONFIG;
  return {
    slides: Array.isArray(raw.slides) && raw.slides.length > 0 ? raw.slides : DEFAULT_HERO_SLIDES,
    spotlight: { ...DEFAULT_HERO_SPOTLIGHT, ...(raw.spotlight || {}) },
    tactical: { ...DEFAULT_TACTICAL_DROP, ...(raw.tactical || {}) },
    archivedCatalog: {
      ...DEFAULT_ARCHIVED_CATALOG,
      ...(raw.archivedCatalog || {}),
      cards:
        Array.isArray(raw.archivedCatalog?.cards) && raw.archivedCatalog.cards.length > 0
          ? raw.archivedCatalog.cards
          : DEFAULT_ARCHIVED_CATALOG.cards,
    },
  };
};

/**
 * Synchronous local retrieval for instant mount (avoids layout shift)
 */
export const getHeroMasterConfig = () => {
  try {
    const raw = localStorage.getItem(MASTER_STORAGE_KEY);
    if (!raw) {
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
    return sanitizeConfig(parsed);
  } catch (e) {
    console.error("Error reading hero master config:", e);
    return DEFAULT_MASTER_CONFIG;
  }
};

/**
 * Asynchronous fetch from backend database with localStorage fallback
 */
export const fetchHeroMasterConfig = async () => {
  try {
    const response = await axios.get(`${API_URL}/hero-config`, { timeout: 10000 });
    if (response.data) {
      const sanitized = sanitizeConfig(response.data);
      // Cache in localStorage for instant subsequent loads
      try {
        localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(sanitized));
        localStorage.setItem(SPOTLIGHT_STORAGE_KEY, JSON.stringify(sanitized.spotlight));
      } catch (storageErr) {
        console.warn("Could not cache to localStorage:", storageErr.message);
      }

      // Dispatch live update events
      window.dispatchEvent(new CustomEvent("heroConfigUpdated", { detail: sanitized }));
      window.dispatchEvent(new CustomEvent("heroSpotlightUpdated", { detail: sanitized.spotlight }));

      return sanitized;
    }
  } catch (err) {
    console.warn("Failed to fetch hero config from backend, using local fallback:", err.message);
  }
  return getHeroMasterConfig();
};

/**
 * Upload an image file for Hero slide/card directly to backend / Cloudinary
 * Returns permanent URL (e.g. https://res.cloudinary.com/... or /uploads/...)
 */
export const uploadHeroImageFile = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(`${API_URL}/hero-config/upload-image`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  });

  if (!response.data?.url) {
    throw new Error(response.data?.message || "Failed to get image URL from server");
  }

  return response.data.url;
};

/**
 * Save master configuration to backend database and update local state
 */
export const saveHeroMasterConfig = async (config) => {
  const current = getHeroMasterConfig();
  const merged = {
    slides:
      Array.isArray(config.slides) && config.slides.length > 0
        ? config.slides
        : current.slides || DEFAULT_HERO_SLIDES,
    spotlight: { ...current.spotlight, ...(config.spotlight || {}) },
    tactical: { ...current.tactical, ...(config.tactical || {}) },
    archivedCatalog: {
      ...current.archivedCatalog,
      ...(config.archivedCatalog || {}),
    },
  };

  // 1. Optimistic local cache & event trigger for instant preview
  try {
    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(SPOTLIGHT_STORAGE_KEY, JSON.stringify(merged.spotlight));
  } catch (err) {
    console.warn("Could not write to localStorage (quota or disabled):", err.message);
  }

  window.dispatchEvent(new CustomEvent("heroConfigUpdated", { detail: merged }));
  window.dispatchEvent(new CustomEvent("heroSpotlightUpdated", { detail: merged.spotlight }));

  if (typeof BroadcastChannel !== "undefined") {
    try {
      const channel = new BroadcastChannel(HERO_CHANNEL_NAME);
      channel.postMessage({ type: "HERO_CONFIG_UPDATED", config: merged });
      channel.close();
    } catch {}
  }

  // 2. Persist to Backend MongoDB
  try {
    const response = await axios.put(`${API_URL}/hero-config`, merged, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    if (response.data?.config) {
      const sanitized = sanitizeConfig(response.data.config);
      localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(sanitized));
      return { success: true, config: sanitized };
    }
    return { success: true, config: merged };
  } catch (backendErr) {
    console.error("Backend error saving hero config:", backendErr);
    // Return partial success if saved locally, with error message
    return {
      success: true,
      savedLocally: true,
      backendError: backendErr.response?.data?.message || backendErr.message,
      config: merged,
    };
  }
};

/**
 * Reset all Hero configurations to pristine defaults both on backend and locally
 */
export const resetHeroMasterConfig = async () => {
  try {
    // 1. Backend reset call
    try {
      await axios.post(
        `${API_URL}/hero-config/reset`,
        {},
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );
    } catch (backendErr) {
      console.warn("Backend reset failed, resetting local store:", backendErr.message);
    }

    // 2. Clear localStorage
    localStorage.removeItem(MASTER_STORAGE_KEY);
    localStorage.removeItem(SPOTLIGHT_STORAGE_KEY);

    // 3. Dispatch events
    window.dispatchEvent(
      new CustomEvent("heroConfigUpdated", { detail: DEFAULT_MASTER_CONFIG })
    );
    window.dispatchEvent(
      new CustomEvent("heroSpotlightUpdated", {
        detail: DEFAULT_HERO_SPOTLIGHT,
      })
    );

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const channel = new BroadcastChannel(HERO_CHANNEL_NAME);
        channel.postMessage({
          type: "HERO_CONFIG_UPDATED",
          config: DEFAULT_MASTER_CONFIG,
        });
        channel.close();
      } catch {}
    }

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
