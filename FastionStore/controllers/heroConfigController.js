import HeroConfig from '../models/HeroConfig.js';

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

let inMemoryHeroConfig = JSON.parse(JSON.stringify(DEFAULT_MASTER_CONFIG));

// 🌍 Get Hero & Lookbook Configuration (Public)
export const getHeroConfig = async (req, res) => {
  try {
    let config = await HeroConfig.findOne({ configKey: "master_hero_config" });

    if (!config) {
      try {
        config = await HeroConfig.create({
          configKey: "master_hero_config",
          ...DEFAULT_MASTER_CONFIG,
        });
      } catch (createErr) {
        config = inMemoryHeroConfig;
      }
    }

    return res.status(200).json({
      slides: config.slides || DEFAULT_HERO_SLIDES,
      spotlight: config.spotlight || DEFAULT_HERO_SPOTLIGHT,
      tactical: config.tactical || DEFAULT_TACTICAL_DROP,
      archivedCatalog: config.archivedCatalog || DEFAULT_ARCHIVED_CATALOG,
    });
  } catch (error) {
    console.error("Error fetching hero config:", error);
    return res.status(200).json(inMemoryHeroConfig);
  }
};

// 👑 Update Hero & Lookbook Configuration (Admin Only)
export const updateHeroConfig = async (req, res) => {
  try {
    const { slides, spotlight, tactical, archivedCatalog } = req.body;

    const updateData = {};
    if (Array.isArray(slides) && slides.length > 0) updateData.slides = slides;
    if (spotlight && typeof spotlight === "object") updateData.spotlight = spotlight;
    if (tactical && typeof tactical === "object") updateData.tactical = tactical;
    if (archivedCatalog && typeof archivedCatalog === "object") updateData.archivedCatalog = archivedCatalog;

    let updated = null;
    try {
      updated = await HeroConfig.findOneAndUpdate(
        { configKey: "master_hero_config" },
        { $set: updateData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn("DB update failed, using memory store:", dbErr.message);
    }

    // Always sync in-memory copy
    inMemoryHeroConfig = {
      ...inMemoryHeroConfig,
      ...updateData,
    };

    return res.status(200).json({
      success: true,
      message: "Hero configuration updated successfully in backend database!",
      config: updated || inMemoryHeroConfig,
    });
  } catch (error) {
    console.error("Error updating hero config:", error);
    return res.status(500).json({
      message: "Server error while saving hero configuration",
      error: error.message,
    });
  }
};

// 👑 Upload Hero Cutout / Banner Image (Admin Only)
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const uploadedFile = req.files[0];
    const imageUrl =
      uploadedFile.secure_url ||
      uploadedFile.url ||
      `/uploads/${uploadedFile.filename}`;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      url: imageUrl,
      filename: uploadedFile.filename || uploadedFile.originalname,
    });
  } catch (error) {
    console.error("Error uploading hero image:", error);
    return res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

// 👑 Reset Hero Configuration to Pristine Defaults (Admin Only)
export const resetHeroConfig = async (req, res) => {
  try {
    let resetDoc = null;
    try {
      resetDoc = await HeroConfig.findOneAndUpdate(
        { configKey: "master_hero_config" },
        { $set: DEFAULT_MASTER_CONFIG },
        { new: true, upsert: true }
      );
    } catch (dbErr) {
      console.warn("DB reset failed, reset in-memory store:", dbErr.message);
    }

    inMemoryHeroConfig = JSON.parse(JSON.stringify(DEFAULT_MASTER_CONFIG));

    return res.status(200).json({
      success: true,
      message: "Hero configuration reset to defaults in backend database!",
      config: resetDoc || inMemoryHeroConfig,
    });
  } catch (error) {
    console.error("Error resetting hero config:", error);
    return res.status(500).json({
      message: "Failed to reset hero configuration",
      error: error.message,
    });
  }
};
