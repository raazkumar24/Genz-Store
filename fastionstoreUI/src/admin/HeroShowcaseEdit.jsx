import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame,
  Search,
  Check,
  RotateCcw,
  ArrowUpRight,
  Sliders,
  Layers,
  Shirt,
  Tag,
  Plus,
  Trash2,
  Eye,
  Image as ImageIcon,
  Compass,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import {
  getHeroMasterConfig,
  saveHeroMasterConfig,
  resetHeroMasterConfig,
  DEFAULT_ARCHIVED_CATALOG,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HERO_SPOTLIGHT,
} from "../services/heroShowcaseService";

const BADGE_PRESETS = [
  "HEAVYWEIGHT 240 GSM TEE",
  "HEAVYWEIGHT 280 GSM TEE",
  "HEAVYWEIGHT 380 GSM HOODIE",
  "400 GSM ACID WASH HOODIE",
  "TACTICAL RIPSTOP CARGO",
  "OVERSIZED BOX FIT",
  "LIMITED ARCHIVAL DROP",
];

const MODEL_PRESETS = [
  { name: "Model 1 (Studio Gray Tee)", path: "/models/model1.png" },
  { name: "Model 2 (Brown Relaxed)", path: "/models/model2.png" },
  { name: "Model 3 (Blue Streetwear)", path: "/models/model3.png" },
  { name: "Model 4 (Black Boxy)", path: "/models/model4.png" },
  { name: "Squad Look (5 Models)", path: "/models/squad_5_models.png" },
];

const LOOKBOOK_PRESETS = {
  winter: {
    sectionTitle: "THIS SEASON'S WINTER DROPS",
    seeAllText: "See All",
    seeAllLink: "/new-arrivals",
    cards: [
      {
        id: "card-1",
        title: "SIMPLE CASUAL",
        subtitle: "More than 100+ collection available for all gender",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        link: "/collections/oversized-tees",
      },
      {
        id: "card-2",
        title: "HANGOUT DRESS",
        subtitle: "More than 100+ collection available for all gender",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
        link: "/new-arrivals",
      },
      {
        id: "card-3",
        title: "COZY ANYWHERE",
        subtitle: "More than 100+ collection available for all gender",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        link: "/collections/hoodies",
      },
      {
        id: "card-4",
        title: "URBAN ROTATION",
        subtitle: "More than 100+ collection available for all gender",
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
        link: "/collections/cargos",
      },
      {
        id: "card-5",
        title: "TACTICAL STREET",
        subtitle: "More than 100+ collection available for all gender",
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
        link: "/sale",
      },
    ],
  },
  summer: {
    sectionTitle: "SUMMER ESSENTIALS & GRAPHIC DROPS",
    seeAllText: "Explore Edit",
    seeAllLink: "/collections/oversized-tees",
    cards: [
      {
        id: "card-s1",
        title: "HEAVYWEIGHT TEES",
        subtitle: "280 GSM combed organic cotton in relaxed drop cut",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        link: "/collections/oversized-tees",
      },
      {
        id: "card-s2",
        title: "RELAXED SHORTS",
        subtitle: "French terry raw-edge sweatshorts with drawstring",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
        link: "/collections/cargos",
      },
      {
        id: "card-s3",
        title: "MINIMAL ACCESSORIES",
        subtitle: "Tactical crossbody bags and stainless streetwear jewelry",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        link: "/new-arrivals",
      },
    ],
  },
};

const HeroShowcaseEdit = () => {
  const { products } = useProducts();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Active studio tab: "slides" (Default) | "lookbook" | "spotlight"
  const [activeTab, setActiveTab] = useState("slides");

  // Master Configuration State
  const [masterConfig, setMasterConfig] = useState(getHeroMasterConfig);
  const [saving, setSaving] = useState(false);

  // Sub-states for specific tabs
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [spotlightSearchTerm, setSpotlightSearchTerm] = useState("");
  const [spotlightCategoryFilter, setSpotlightCategoryFilter] = useState("all");

  useEffect(() => {
    setMasterConfig(getHeroMasterConfig());
  }, []);

  // Update Lookbook Section Header
  const handleLookbookMetaChange = (field, val) => {
    setMasterConfig((prev) => ({
      ...prev,
      archivedCatalog: {
        ...prev.archivedCatalog,
        [field]: val,
      },
    }));
  };

  // Update specific Lookbook Card
  const handleLookbookCardChange = (index, field, val) => {
    setMasterConfig((prev) => {
      const cards = [...(prev.archivedCatalog?.cards || [])];
      if (cards[index]) {
        cards[index] = { ...cards[index], [field]: val };
      }
      return {
        ...prev,
        archivedCatalog: {
          ...prev.archivedCatalog,
          cards,
        },
      };
    });
  };

  // Add new Lookbook Card
  const handleAddLookbookCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: "NEW LOOKBOOK DROP",
      subtitle: "More than 100+ collection available for all gender",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      link: "/new-arrivals",
    };
    setMasterConfig((prev) => ({
      ...prev,
      archivedCatalog: {
        ...prev.archivedCatalog,
        cards: [...(prev.archivedCatalog?.cards || []), newCard],
      },
    }));
    addToast("New Lookbook card added!", "info");
  };

  // Remove Lookbook Card
  const handleRemoveLookbookCard = (index) => {
    const currentCards = masterConfig.archivedCatalog?.cards || [];
    if (currentCards.length <= 1) {
      addToast("Lookbook carousel must have at least 1 card.", "warning");
      return;
    }
    const filtered = currentCards.filter((_, i) => i !== index);
    setMasterConfig((prev) => ({
      ...prev,
      archivedCatalog: {
        ...prev.archivedCatalog,
        cards: filtered,
      },
    }));
    addToast("Lookbook card removed.", "info");
  };

  // Apply Lookbook Preset
  const handleApplyLookbookPreset = (presetKey) => {
    const preset = LOOKBOOK_PRESETS[presetKey];
    if (!preset) return;
    setMasterConfig((prev) => ({
      ...prev,
      archivedCatalog: {
        ...preset,
      },
    }));
    addToast(`Applied "${preset.sectionTitle}" preset!`, "success");
  };

  // Update Hero Slide Field
  const handleSlideChange = (field, val) => {
    setMasterConfig((prev) => {
      const slides = [...(prev.slides || DEFAULT_HERO_SLIDES)];
      if (slides[selectedSlideIndex]) {
        slides[selectedSlideIndex] = {
          ...slides[selectedSlideIndex],
          [field]: val,
        };
      }
      return { ...prev, slides };
    });
  };

  // Add a new slide to Hero Left Slider
  const handleAddSlide = () => {
    const currentSlides = masterConfig.slides || DEFAULT_HERO_SLIDES;
    const nextNum = String(currentSlides.length + 1).padStart(2, "0");
    const newSlide = {
      id: `slide-${Date.now()}`,
      number: nextNum,
      badge: `DROP ${nextNum} - 2026`,
      tag: "OVERSIZED FIT",
      title: "Heavyweight Boxy Streetwear Silhouette.",
      specHeadline: "Studio Relaxed Cut",
      specDetail: "280 GSM combed organic cotton with relaxed drop-shoulder cut and anti-fade reactive dye.",
      primaryCta: `Explore Drop ${nextNum}`,
      primaryLink: "/new-arrivals",
      accentBadge: "100% Supima Cotton",
      stats: "280 GSM • Heavy Combed",
      image: `/models/model${((currentSlides.length) % 4) + 1}.png`,
    };
    const updated = [...currentSlides, newSlide];
    setMasterConfig((prev) => ({ ...prev, slides: updated }));
    setSelectedSlideIndex(currentSlides.length);
    addToast(`New Hero Slide ${nextNum} added!`, "success");
  };

  // Remove current slide from Hero Left Slider
  const handleRemoveSlide = (idx) => {
    const currentSlides = masterConfig.slides || DEFAULT_HERO_SLIDES;
    if (currentSlides.length <= 1) {
      addToast("Hero banner me kam se kam 1 slide honi chahiye.", "warning");
      return;
    }
    const updated = currentSlides.filter((_, i) => i !== idx);
    setMasterConfig((prev) => ({ ...prev, slides: updated }));
    setSelectedSlideIndex((prev) => Math.max(0, Math.min(prev, updated.length - 1)));
    addToast("Hero slide delete ho gayi.", "info");
  };

  // Model image direct upload (FileReader converts to Base64, saved in localStorage - no DB needed!)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      addToast("Image size 3.5MB se kam hona chahiye browser storage ke liye.", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        handleSlideChange("image", dataUrl);
        addToast("Model image updated! Save button click karke publish karein.", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Update Spotlight Bento Field
  const handleSpotlightChange = (field, val) => {
    setMasterConfig((prev) => ({
      ...prev,
      spotlight: {
        ...(prev.spotlight || DEFAULT_HERO_SPOTLIGHT),
        [field]: val,
      },
    }));
  };


  // Filter products for Spotlight Picker
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter((p) => {
      const text = [p.name, ...(p.category || []), ...(p.collection || [])]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        !spotlightSearchTerm.trim() ||
        text.includes(spotlightSearchTerm.toLowerCase().trim());

      let matchesCat = true;
      if (spotlightCategoryFilter === "tee") {
        matchesCat = text.includes("tee") || text.includes("t-shirt") || text.includes("tshirt");
      } else if (spotlightCategoryFilter === "hoodie") {
        matchesCat = text.includes("hoodie") || text.includes("sweatshirt") || text.includes("fleece");
      } else if (spotlightCategoryFilter === "cargo") {
        matchesCat = text.includes("cargo") || text.includes("pant") || text.includes("baggy");
      }

      return matchesSearch && matchesCat;
    });
  }, [products, spotlightSearchTerm, spotlightCategoryFilter]);

  // Spotlight Selected Product
  const selectedProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    const currentSpotlight = masterConfig.spotlight || DEFAULT_HERO_SPOTLIGHT;
    if (currentSpotlight.productId) {
      return products.find((p) => p._id === currentSpotlight.productId) || products[0];
    }
    if (currentSpotlight.targetCategory === "tee") {
      return (
        products.find((p) => {
          const t = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
          return t.includes("tee") || t.includes("tshirt");
        }) || products[0]
      );
    }
    return (
      products.find((p) => {
        const t = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
        return t.includes("hoodie") || t.includes("fleece");
      }) || products[0]
    );
  }, [products, masterConfig.spotlight]);

  const spotlightPreviewImage =
    masterConfig.spotlight?.customImage ||
    selectedProduct?.variants?.find((v) => v.images && v.images.length > 0)?.images?.[0] ||
    selectedProduct?.variants?.[0]?.images?.[0] ||
    selectedProduct?.image ||
    "/models/model1.png";

  const spotlightPreviewTitle =
    masterConfig.spotlight?.title || selectedProduct?.name || "Signature Drop Showcase";

  const spotlightPreviewPrice =
    masterConfig.spotlight?.customPrice ||
    selectedProduct?.variants?.[0]?.salePrice ||
    selectedProduct?.variants?.[0]?.price ||
    1499;

  // Pick a product for spotlight
  const handleSelectProductForSpotlight = (product) => {
    const isTee = [product.name, ...(product.category || [])].join(" ").toLowerCase().includes("tee");
    const isHoodie = [product.name, ...(product.category || [])].join(" ").toLowerCase().includes("hoodie");

    setMasterConfig((prev) => ({
      ...prev,
      spotlight: {
        ...(prev.spotlight || DEFAULT_HERO_SPOTLIGHT),
        productId: product._id,
        title: product.name,
        targetCategory: isTee ? "tee" : isHoodie ? "hoodie" : "custom",
        badgeText: isTee
          ? "HEAVYWEIGHT 240 GSM TEE"
          : isHoodie
          ? "HEAVYWEIGHT 380 GSM HOODIE"
          : "LIMITED ARCHIVAL DROP",
        subtitle: isTee
          ? "Bio-washed combed cotton with relaxed drop shoulder."
          : "Drop shoulder & double-needle ribbed hem.",
        customPrice: "",
        customImage: "",
      },
    }));
    addToast(`Selected "${product.name}" for Hero Spotlight!`, "info");
  };

  // Save changes
  const handleSave = () => {
    setSaving(true);
    const success = saveHeroMasterConfig(masterConfig);
    setTimeout(() => {
      setSaving(false);
      if (success) {
        addToast("Hero & Lookbook Studio updated live across Storefront!", "success");
      } else {
        addToast("Failed to save changes. Please try again.", "error");
      }
    }, 250);
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm("Reset all Hero Slides, Bento Cards, and Archived Lookbook to defaults?")) {
      resetHeroMasterConfig();
      setMasterConfig(getHeroMasterConfig());
      addToast("Reset all Hero & Lookbook components to pristine defaults.", "info");
    }
  };

  const activeSlide = (masterConfig.slides || DEFAULT_HERO_SLIDES)[selectedSlideIndex] || DEFAULT_HERO_SLIDES[0];
  const lookbookCards = masterConfig.archivedCatalog?.cards || DEFAULT_ARCHIVED_CATALOG.cards;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white shadow-xs">
              <Compass size={16} className="text-amber-400" />
            </span>
            <h1
              className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Hero & Lookbook Studio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-2xl">
            Live master control for Winter Drops Lookbook, Editorial Hero Slides, and Bento Showcase. Changes reflect instantly!
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Check size={15} strokeWidth={3} className="text-emerald-400" />
            <span>{saving ? "Saving..." : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl max-w-full overflow-x-auto hide-scrollbar border border-gray-200/80">
        <button
          type="button"
          onClick={() => setActiveTab("slides")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "slides"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Flame size={15} className="text-[#FF3B00]" />
          <span>Hero Banner & Model (Left Slider)</span>
          <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-orange-100 text-[#FF3B00]">
            Main Stage
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("lookbook")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "lookbook"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers size={15} />
          <span>Archived Lookbook ("Winter Drops")</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("spotlight")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            activeTab === "spotlight"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Shirt size={15} />
          <span>Right Bento Spotlight Drop</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ARCHIVED CATALOG LOOKBOOK (MATCHES SCREENSHOT)                     */}
      {/* ========================================================================= */}
      {activeTab === "lookbook" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Lookbook Settings & Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Presets */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Sliders size={14} className="text-[var(--color-primary)]" />
                  Quick Lookbook Presets
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">1-Click Setup</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyLookbookPreset("winter")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-black transition-all cursor-pointer shadow-xs"
                >
                  Winter Drops (Reference Style)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyLookbookPreset("summer")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-300 transition-all cursor-pointer shadow-xs"
                >
                  Summer Streetwear Edit
                </button>
              </div>
            </div>

            {/* Section Header Configuration */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Tag size={15} className="text-[var(--color-primary)]" />
                Section Header & Navigation
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Section Headline
                  </label>
                  <input
                    type="text"
                    value={masterConfig.archivedCatalog?.sectionTitle || ""}
                    onChange={(e) => handleLookbookMetaChange("sectionTitle", e.target.value)}
                    placeholder="e.g. THIS SEASON'S WINTER DROPS"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm font-black uppercase tracking-tight"
                  />
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    This displays prominently above the carousel in heavy condensed streetwear typography.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={masterConfig.archivedCatalog?.seeAllText || ""}
                      onChange={(e) => handleLookbookMetaChange("seeAllText", e.target.value)}
                      placeholder="e.g. See All"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={masterConfig.archivedCatalog?.seeAllLink || ""}
                      onChange={(e) => handleLookbookMetaChange("seeAllLink", e.target.value)}
                      placeholder="e.g. /new-arrivals"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lookbook Cards List */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <ImageIcon size={15} className="text-[var(--color-primary)]" />
                    Lookbook Cards ({lookbookCards.length} items)
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    Vertical full-bleed lifestyle photography with bottom condensed typography.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLookbookCard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 text-white hover:bg-black text-[11px] font-black uppercase tracking-wider transition cursor-pointer shadow-xs"
                >
                  <Plus size={13} />
                  Add Card
                </button>
              </div>

              <div className="space-y-4">
                {lookbookCards.map((card, idx) => (
                  <div
                    key={card.id || idx}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-gray-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-700 bg-gray-200/80 px-2 py-0.5 rounded-md">
                        Card #{idx + 1}
                      </span>
                      {lookbookCards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLookbookCard(idx)}
                          className="text-gray-400 hover:text-rose-600 transition p-1 cursor-pointer"
                          title="Remove Card"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                          Card Title
                        </label>
                        <input
                          type="text"
                          value={card.title || ""}
                          onChange={(e) => handleLookbookCardChange(idx, "title", e.target.value)}
                          placeholder="e.g. SIMPLE CASUAL"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-black text-xs font-black uppercase tracking-tight bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                          Collection Link URL
                        </label>
                        <input
                          type="text"
                          value={card.link || ""}
                          onChange={(e) => handleLookbookCardChange(idx, "link", e.target.value)}
                          placeholder="e.g. /collections/oversized-tees"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-black text-xs font-mono bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Card Subtitle
                      </label>
                      <input
                        type="text"
                        value={card.subtitle || ""}
                        onChange={(e) => handleLookbookCardChange(idx, "subtitle", e.target.value)}
                        placeholder="e.g. More than 100+ collection available for all gender"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-black text-xs font-medium bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Model / Lifestyle Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={card.image || ""}
                          onChange={(e) => handleLookbookCardChange(idx, "image", e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-black text-xs font-mono bg-white"
                        />
                        <div className="h-8 w-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                          <img
                            src={card.image}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/models/model1.png";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Lookbook Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Eye size={14} className="text-emerald-500" />
                  Lookbook Live Preview
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Exact Customer View
                </span>
              </div>

              {/* Mini Section Container matching screenshot */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className="text-lg sm:text-xl font-black uppercase text-neutral-950 leading-none tracking-tight"
                    style={{ fontFamily: "var(--font-condensed)" }}
                  >
                    {masterConfig.archivedCatalog?.sectionTitle || "THIS SEASON'S WINTER DROPS"}
                  </h3>
                  <div className="px-2.5 py-1 rounded-full border border-neutral-300 bg-white text-[10px] font-semibold text-neutral-800 flex items-center gap-1 shrink-0">
                    <span>{masterConfig.archivedCatalog?.seeAllText || "See All"}</span>
                    <ArrowUpRight size={12} strokeWidth={2.2} />
                  </div>
                </div>

                {/* Card preview row */}
                <div className="grid grid-cols-2 gap-2.5">
                  {(lookbookCards.slice(0, 2)).map((card, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[3/4.5] rounded-2xl overflow-hidden bg-neutral-900 shadow-sm border border-neutral-200"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/models/model1.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-40% to-transparent flex flex-col justify-end p-3 text-white">
                        <h4
                          className="text-sm font-black uppercase tracking-wide text-white drop-shadow-sm leading-none"
                          style={{ fontFamily: "var(--font-condensed)" }}
                        >
                          {card.title}
                        </h4>
                        <p className="text-[8px] text-white/90 line-clamp-1 mt-1 font-normal">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider text-center pt-1">
                  + {Math.max(0, lookbookCards.length - 2)} more cards in horizontal scroll
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="mt-4 w-full py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check size={16} strokeWidth={3} className="text-emerald-400" />
                <span>Publish Lookbook To Storefront</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: HERO EDITORIAL SLIDES & MODEL IMAGE STUDIO                         */}
      {/* ========================================================================= */}
      {activeTab === "slides" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Slide Selection & Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Slide Selection Bar with Add / Delete Buttons */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Flame size={15} className="text-[#FF3B00]" />
                  Select Slide To Edit ({(masterConfig.slides || DEFAULT_HERO_SLIDES).length} Slides)
                </span>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-wider transition cursor-pointer shadow-xs"
                >
                  <Plus size={13} />
                  Add Slide
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {(masterConfig.slides || DEFAULT_HERO_SLIDES).map((slide, idx) => {
                  const isSelected = selectedSlideIndex === idx;
                  return (
                    <div
                      key={slide.id || idx}
                      className={`relative p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900/20"
                          : "bg-gray-50 text-neutral-700 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedSlideIndex(idx)}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                            isSelected ? "text-neutral-300" : "text-neutral-500"
                          }`}
                        >
                          SLIDE {slide.number || `0${idx + 1}`}
                        </span>
                        {(masterConfig.slides || DEFAULT_HERO_SLIDES).length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSlide(idx);
                            }}
                            className={`p-1 rounded-md transition ${
                              isSelected
                                ? "text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
                                : "text-neutral-400 hover:text-red-600 hover:bg-gray-200"
                            }`}
                            title="Delete this slide"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <span className="text-xs font-black truncate block">
                        {slide.tag || `Drop 0${idx + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Model Cutout Image Studio (File Upload + Presets + URL) */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <ImageIcon size={15} className="text-[#FF3B00]" />
                    Slide 0{selectedSlideIndex + 1} Model Image
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Model ki transparent cutout photo upload karein ya preset select karein.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Zero Database • Instant Local
                </span>
              </div>

              {/* Direct File Upload Button */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/70 hover:bg-white hover:border-black transition-all flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                    <Upload size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-gray-900 block">
                      Upload Model Photo From Computer
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      PNG/JPG/WEBP (Recommended transparent background, under 3.5MB)
                    </span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-black hover:bg-[#FF3B00] text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
                >
                  <Upload size={13} />
                  <span>Choose Image File</span>
                </button>
              </div>

              {/* 1-Click Preset Model Cutouts */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Or Quick Select Studio Model Presets:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {MODEL_PRESETS.map((m) => {
                    const isSelected = activeSlide.image === m.path;
                    return (
                      <button
                        key={m.path}
                        type="button"
                        onClick={() => handleSlideChange("image", m.path)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? "bg-black text-white border-black shadow-sm ring-2 ring-black/20"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="h-14 w-full rounded-lg bg-white/80 border border-gray-200 flex items-center justify-center overflow-hidden p-1">
                          <img
                            src={m.path}
                            alt=""
                            className="h-full w-auto object-contain drop-shadow-sm"
                          />
                        </div>
                        <span className="text-[10px] font-bold truncate max-w-full">
                          {m.name.split(" ")[0]} {m.name.split(" ")[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual URL Input */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Or Image URL / Relative Path
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={activeSlide.image || ""}
                    onChange={(e) => handleSlideChange("image", e.target.value)}
                    placeholder="e.g. /models/model1.png or https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 pl-9 rounded-xl border border-gray-300 focus:border-black text-xs font-mono bg-white"
                  />
                  <LinkIcon size={14} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Product Catalog Image Picker */}
              {products && products.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Or Pick Cutout From Store Products:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
                    {products.slice(0, 8).map((p) => {
                      const pImg =
                        p.variants?.[0]?.images?.[0] ||
                        p.image ||
                        "/models/model1.png";
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => handleSlideChange("image", pImg)}
                          className="h-12 w-12 rounded-xl border border-gray-200 bg-white p-1 shrink-0 hover:border-black hover:scale-105 transition cursor-pointer"
                          title={p.name}
                        >
                          <img
                            src={pImg}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Left-Side Editorial Content & Text Typography */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Flame size={15} className="text-[#FF3B00]" />
                Left-Side Streetwear Editorial Content
              </h2>

              <div className="space-y-3.5">
                {/* Badge & Flame Tag Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={activeSlide.badge || ""}
                      onChange={(e) => handleSlideChange("badge", e.target.value)}
                      placeholder="e.g. DROP 04 - 2026"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["DROP 04 - 2026", "NEW SEASON", "LIMITED RELEASE", "EXCLUSIVE DROP"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleSlideChange("badge", preset)}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Flame Category Tag
                    </label>
                    <input
                      type="text"
                      value={activeSlide.tag || ""}
                      onChange={(e) => handleSlideChange("tag", e.target.value)}
                      placeholder="e.g. OVERSIZED FIT"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["OVERSIZED FIT", "TECHNICAL FLEECE", "STREET ESSENTIALS", "SIGNATURE FIT"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleSlideChange("tag", preset)}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Big Headline */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Main Headline Title (Big Streetwear Heading)
                  </label>
                  <input
                    type="text"
                    value={activeSlide.title || ""}
                    onChange={(e) => handleSlideChange("title", e.target.value)}
                    placeholder="e.g. Heavyweight Boxy Streetwear."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-sm font-black text-gray-950"
                  />
                </div>

                {/* Spec Number & Spec Headline */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Number
                    </label>
                    <input
                      type="text"
                      value={activeSlide.number || "01"}
                      onChange={(e) => handleSlideChange("number", e.target.value)}
                      placeholder="01"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-mono font-black"
                    />
                  </div>

                  <div className="sm:col-span-9">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Spec Headline
                    </label>
                    <input
                      type="text"
                      value={activeSlide.specHeadline || ""}
                      onChange={(e) => handleSlideChange("specHeadline", e.target.value)}
                      placeholder="e.g. Clear Silhouettes"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Spec Detail Description */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Spec Detail Description
                  </label>
                  <textarea
                    rows={2}
                    value={activeSlide.specDetail || ""}
                    onChange={(e) => handleSlideChange("specDetail", e.target.value)}
                    placeholder="e.g. 280 GSM combed organic cotton with relaxed drop-shoulder cut and anti-fade reactive dye."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-medium leading-relaxed"
                  />
                </div>

                {/* Fabric Stats & Floating Accent Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Fabric Stats (Bottom Bar)
                    </label>
                    <input
                      type="text"
                      value={activeSlide.stats || ""}
                      onChange={(e) => handleSlideChange("stats", e.target.value)}
                      placeholder="e.g. 280 GSM • Heavy Combed"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Floating Model Accent Pill
                    </label>
                    <input
                      type="text"
                      value={activeSlide.accentBadge || ""}
                      onChange={(e) => handleSlideChange("accentBadge", e.target.value)}
                      placeholder="e.g. 100% Supima Cotton"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Primary CTA Button Text & Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={activeSlide.primaryCta || ""}
                      onChange={(e) => handleSlideChange("primaryCta", e.target.value)}
                      placeholder="e.g. Explore Drop 04"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={activeSlide.primaryLink || ""}
                      onChange={(e) => handleSlideChange("primaryLink", e.target.value)}
                      placeholder="e.g. /new-arrivals"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-mono"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {[
                        { label: "New Arrivals", url: "/new-arrivals" },
                        { label: "Oversized Tees", url: "/collections/oversized-tees" },
                        { label: "Hoodies", url: "/collections/hoodies" },
                        { label: "Cargos", url: "/collections/cargos" },
                        { label: "Sale", url: "/sale" },
                      ].map((item) => (
                        <button
                          key={item.url}
                          type="button"
                          onClick={() => handleSlideChange("primaryLink", item.url)}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Storefront Hero Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Eye size={14} className="text-emerald-500" />
                  Hero Slider Live Preview (Slide 0{selectedSlideIndex + 1})
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  Storefront View
                </span>
              </div>

              {/* Exact Storefront Hero Stage Preview */}
              <div className="relative rounded-none border border-neutral-300 bg-white p-5 shadow-sm min-h-[380px] flex flex-col justify-between overflow-hidden">
                {/* Top Row: Badges & Indicators */}
                <div className="flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-900 text-[9px] font-mono font-bold uppercase tracking-wider border border-neutral-200">
                      {activeSlide.badge || "DROP 04 - 2026"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[9px] font-mono font-black uppercase tracking-wider">
                      <Flame size={10} className="text-[#FF3B00] fill-[#FF3B00]" />
                      {activeSlide.tag || "OVERSIZED FIT"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {(masterConfig.slides || DEFAULT_HERO_SLIDES).map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1 transition-all ${
                          idx === selectedSlideIndex ? "w-4 bg-black" : "w-1.5 bg-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Middle Content + Cutout */}
                <div className="grid grid-cols-12 gap-3 items-center my-3 z-10">
                  {/* Left Editorial Copy */}
                  <div className="col-span-7 space-y-2">
                    <h3
                      className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-950 leading-tight"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {activeSlide.title || "Heavyweight Boxy Streetwear."}
                    </h3>

                    <div className="flex items-start gap-2 pt-1 border-l-2 border-neutral-300 pl-2.5">
                      <span className="text-sm font-black text-neutral-300 font-mono">
                        {activeSlide.number || "01"}
                      </span>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-neutral-950 font-mono">
                          {activeSlide.specHeadline || "Clear Silhouettes"}
                        </p>
                        <p className="text-[9px] text-neutral-600 line-clamp-2 leading-relaxed">
                          {activeSlide.specDetail || "280 GSM combed organic cotton with relaxed drop-shoulder cut."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-[9px] font-mono font-black uppercase tracking-wider">
                        <span>{activeSlide.primaryCta || "Explore Drop"}</span>
                        <ArrowUpRight size={10} strokeWidth={2.5} />
                      </span>
                      <span className="inline-flex items-center px-2 py-1.5 border border-black bg-white text-black text-[9px] font-mono font-bold uppercase tracking-wider">
                        Archive Sale
                      </span>
                    </div>
                  </div>

                  {/* Right Cutout Showcase */}
                  <div className="col-span-5 relative h-48 flex items-center justify-center">
                    <img
                      src={activeSlide.image || "/models/model1.png"}
                      alt=""
                      className="h-full w-auto max-h-full max-w-full object-contain object-bottom drop-shadow-lg select-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/models/model1.png";
                      }}
                    />
                    <div className="absolute bottom-1 right-1 bg-white/95 border border-neutral-200 px-1.5 py-0.5 text-[8px] font-mono font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1 shadow-xs">
                      <span className="h-1.5 w-1.5 bg-emerald-500" />
                      {activeSlide.accentBadge || "100% Cotton"}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Stats */}
                <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider z-10">
                  <span>{activeSlide.stats || "280 GSM • Heavy Combed"}</span>
                  <span className="text-[#FF3B00]">GENZ ARCHIVE // DROP</span>
                </div>
              </div>

              {/* Publish Changes Button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-4 w-full py-3.5 rounded-2xl bg-black hover:bg-[#FF3B00] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Check size={16} strokeWidth={3} className="text-emerald-400" />
                <span>{saving ? "Publishing Changes..." : "Publish To Homepage Storefront"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RIGHT BENTO SPOTLIGHT & TACTICAL                                   */}
      {/* ========================================================================= */}
      {activeTab === "spotlight" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Spotlight Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Fast Switchers */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs">
              <span className="text-xs font-black uppercase tracking-wider text-gray-900 block mb-3 flex items-center gap-1.5">
                <Sliders size={14} className="text-[var(--color-primary)]" />
                1-Click Category Drop Switchers
              </span>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleSpotlightChange("targetCategory", "tee");
                    handleSpotlightChange("badgeText", "HEAVYWEIGHT 240 GSM TEE");
                    addToast("Set to Heavyweight T-Shirt Drop", "info");
                  }}
                  className={`flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    masterConfig.spotlight?.targetCategory === "tee"
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Shirt size={16} className="mb-1" />
                  <span className="text-xs font-black uppercase tracking-wider">T-Shirt Drop</span>
                  <span className="text-[10px] opacity-70">240 GSM Boxy</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSpotlightChange("targetCategory", "hoodie");
                    handleSpotlightChange("badgeText", "HEAVYWEIGHT 380 GSM HOODIE");
                    addToast("Set to Heavyweight Hoodie Drop", "info");
                  }}
                  className={`flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    masterConfig.spotlight?.targetCategory === "hoodie"
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Flame size={16} className="mb-1" />
                  <span className="text-xs font-black uppercase tracking-wider">Hoodie Drop</span>
                  <span className="text-[10px] opacity-70">380 GSM Fleece</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSpotlightChange("targetCategory", "cargo");
                    handleSpotlightChange("badgeText", "TACTICAL RIPSTOP CARGO");
                    addToast("Set to Parachute Cargos Drop", "info");
                  }}
                  className={`flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    masterConfig.spotlight?.targetCategory === "cargo"
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Layers size={16} className="mb-1" />
                  <span className="text-xs font-black uppercase tracking-wider">Cargo Drop</span>
                  <span className="text-[10px] opacity-70">Ripstop Baggy</span>
                </button>
              </div>
            </div>

            {/* Product Picker from Inventory */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Search size={14} className="text-[var(--color-primary)]" />
                  Select Store Product Drop
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    value={spotlightSearchTerm}
                    onChange={(e) => setSpotlightSearchTerm(e.target.value)}
                    placeholder="Search product..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-black w-44"
                  />
                  <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {["all", "tee", "hoodie", "cargo"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSpotlightCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                      spotlightCategoryFilter === cat
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {cat === "all" ? "All Drops" : cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100">
                {filteredProducts.slice(0, 10).map((prod) => {
                  const isSelected =
                    masterConfig.spotlight?.productId === prod._id ||
                    (!masterConfig.spotlight?.productId && selectedProduct?._id === prod._id);
                  const img =
                    prod.variants?.[0]?.images?.[0] || prod.image || "/models/model1.png";
                  const price = prod.variants?.[0]?.salePrice || prod.variants?.[0]?.price || 1499;

                  return (
                    <button
                      key={prod._id}
                      type="button"
                      onClick={() => handleSelectProductForSpotlight(prod)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left cursor-pointer ${
                        isSelected
                          ? "bg-neutral-900 text-white"
                          : "hover:bg-gray-50 text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img src={img} alt="" className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{prod.name}</p>
                          <p className={`text-[10px] ${isSelected ? "text-neutral-300" : "text-gray-400"}`}>
                            ₹{price}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check size={16} className="text-emerald-400 shrink-0 mr-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Overrides & Badge Details */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <Tag size={14} className="text-[var(--color-primary)]" />
                Card Style & Custom Overrides
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Card Theme
                  </label>
                  <select
                    value={masterConfig.spotlight?.cardTheme || "dark"}
                    onChange={(e) => handleSpotlightChange("cardTheme", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                  >
                    <option value="dark">Dark Minimal Noir (Recommended)</option>
                    <option value="light">Clean Light Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Badge Preset
                  </label>
                  <select
                    value={masterConfig.spotlight?.badgeText || BADGE_PRESETS[0]}
                    onChange={(e) => handleSpotlightChange("badgeText", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                  >
                    {BADGE_PRESETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Custom Title Override
                  </label>
                  <input
                    type="text"
                    value={masterConfig.spotlight?.title || ""}
                    onChange={(e) => handleSpotlightChange("title", e.target.value)}
                    placeholder={selectedProduct?.name || "Leave empty to use product name"}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Custom Price Override (₹)
                  </label>
                  <input
                    type="number"
                    value={masterConfig.spotlight?.customPrice || ""}
                    onChange={(e) => handleSpotlightChange("customPrice", e.target.value)}
                    placeholder="Leave empty for auto"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Bento Preview */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Eye size={14} className="text-emerald-500" />
                  Hero Bento Card Preview
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {masterConfig.spotlight?.cardTheme === "light" ? "Light Card" : "Dark Card"}
                </span>
              </div>

              {/* Bento Card */}
              {(() => {
                const isLight = masterConfig.spotlight?.cardTheme === "light";
                return (
                  <div
                    className={`rounded-[26px] p-5 border transition-all ${
                      isLight
                        ? "bg-neutral-50 text-neutral-900 border-neutral-200"
                        : "bg-neutral-950 text-white border-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isLight
                            ? "bg-neutral-200 text-neutral-800"
                            : "bg-white/10 text-neutral-200 border border-white/10"
                        }`}
                      >
                        {masterConfig.spotlight?.badgeText || "HEAVYWEIGHT DROP"}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                        Signature Drop
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4
                          className="text-base font-black uppercase tracking-tight leading-tight"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {spotlightPreviewTitle}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                          {masterConfig.spotlight?.subtitle || "Drop shoulder & double-needle ribbed hem."}
                        </p>
                        <p className="text-lg font-black tracking-tight mt-2 text-emerald-400">
                          ₹{spotlightPreviewPrice}
                        </p>
                      </div>

                      <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 p-1.5 shrink-0 flex items-center justify-center">
                        <img
                          src={spotlightPreviewImage}
                          alt=""
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/models/model1.png";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button
                type="button"
                onClick={handleSave}
                className="mt-4 w-full py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check size={16} strokeWidth={3} className="text-emerald-400" />
                <span>Save Spotlight Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroShowcaseEdit;
