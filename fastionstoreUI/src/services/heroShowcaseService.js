/**
 * Hero Spotlight Showcase Service
 * Manages the featured Heavyweight / Spotlight drop card on the Home Page Hero Bento Grid.
 * Allows administrators to switch between Hoodies, T-Shirts, Cargos, or any product in inventory.
 */

const STORAGE_KEY = "genz_hero_spotlight_config";

export const DEFAULT_HERO_SPOTLIGHT = {
  productId: "", // Empty means auto-detect based on category
  targetCategory: "hoodie", // "hoodie" | "tee" | "cargo" | "custom"
  badgeText: "HEAVYWEIGHT 380 GSM",
  title: "", // If empty, uses selected product's name
  subtitle: "Drop shoulder & double-needle ribbed hem.",
  tagPill: "Signature Fit",
  customPrice: "", // If empty, uses product's price
  customImage: "", // If empty, uses product's primary variant image
  cardTheme: "dark", // "dark" | "light"
};

/**
 * Retrieve current Hero Spotlight configuration
 */
export const getHeroSpotlightConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_SPOTLIGHT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_HERO_SPOTLIGHT, ...parsed };
  } catch (e) {
    console.error("Error reading hero spotlight config:", e);
    return DEFAULT_HERO_SPOTLIGHT;
  }
};

/**
 * Save new Hero Spotlight configuration and dispatch update event
 */
export const saveHeroSpotlightConfig = (config) => {
  try {
    const merged = { ...DEFAULT_HERO_SPOTLIGHT, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    // Dispatch cross-component event so Hero updates immediately
    window.dispatchEvent(new CustomEvent("heroSpotlightUpdated", { detail: merged }));
    return true;
  } catch (e) {
    console.error("Error saving hero spotlight config:", e);
    return false;
  }
};

/**
 * Reset Hero Spotlight configuration to default
 */
export const resetHeroSpotlightConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("heroSpotlightUpdated", { detail: DEFAULT_HERO_SPOTLIGHT }));
    return true;
  } catch (e) {
    console.error("Error resetting hero spotlight config:", e);
    return false;
  }
};
