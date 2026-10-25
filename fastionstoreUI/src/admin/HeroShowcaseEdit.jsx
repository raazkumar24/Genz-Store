import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Sliders,
  Layers,
  Shirt,
  Tag,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import {
  getHeroSpotlightConfig,
  saveHeroSpotlightConfig,
  resetHeroSpotlightConfig,
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

const HeroShowcaseEdit = () => {
  const { products, loading } = useProducts();
  const { addToast } = useToast();

  const [config, setConfig] = useState(getHeroSpotlightConfig());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all" | "tee" | "hoodie" | "cargo"
  const [saving, setSaving] = useState(false);

  // Sync state on mount
  useEffect(() => {
    setConfig(getHeroSpotlightConfig());
  }, []);

  // Filter products list based on search and category tab
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter((p) => {
      const text = [p.name, ...(p.category || []), ...(p.collection || [])]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        !searchTerm.trim() || text.includes(searchTerm.toLowerCase().trim());

      let matchesCat = true;
      if (categoryFilter === "tee") {
        matchesCat = text.includes("tee") || text.includes("t-shirt") || text.includes("tshirt");
      } else if (categoryFilter === "hoodie") {
        matchesCat = text.includes("hoodie") || text.includes("sweatshirt") || text.includes("fleece");
      } else if (categoryFilter === "cargo") {
        matchesCat = text.includes("cargo") || text.includes("pant") || text.includes("baggy");
      }

      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, categoryFilter]);

  // Selected product object
  const selectedProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    if (config.productId) {
      return products.find((p) => p._id === config.productId) || products[0];
    }
    // Auto fallback
    if (config.targetCategory === "tee") {
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
  }, [products, config.productId, config.targetCategory]);

  // Compute display details for live preview
  const previewImage =
    config.customImage ||
    selectedProduct?.variants?.find((v) => v.images && v.images.length > 0)?.images?.[0] ||
    selectedProduct?.variants?.[0]?.images?.[0] ||
    selectedProduct?.image ||
    "/models/model1.png";

  const previewTitle = config.title || selectedProduct?.name || "Select A Product Drop";
  const previewPrice =
    config.customPrice ||
    selectedProduct?.variants?.[0]?.salePrice ||
    selectedProduct?.variants?.[0]?.price ||
    1499;

  // Handler to pick a product
  const handleSelectProduct = (product) => {
    const isTee = [product.name, ...(product.category || [])]
      .join(" ")
      .toLowerCase()
      .includes("tee");
    const isHoodie = [product.name, ...(product.category || [])]
      .join(" ")
      .toLowerCase()
      .includes("hoodie");

    setConfig((prev) => ({
      ...prev,
      productId: product._id,
      title: product.name,
      targetCategory: isTee ? "tee" : isHoodie ? "hoodie" : "custom",
      badgeText: isTee
        ? "HEAVYWEIGHT 240 GSM TEE"
        : isHoodie
        ? "HEAVYWEIGHT 380 GSM HOODIE"
        : prev.badgeText,
      subtitle: isTee
        ? "Bio-washed combed cotton with relaxed drop shoulder."
        : "Drop shoulder & double-needle ribbed hem.",
      customPrice: "",
      customImage: "",
    }));
  };

  // Quick 1-click Preset switchers (Tee vs Hoodie vs Cargo)
  const handleQuickPreset = (type) => {
    setCategoryFilter(type);
    if (!products || products.length === 0) return;

    if (type === "tee") {
      const tee = products.find((p) => {
        const t = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
        return t.includes("tee") || t.includes("t-shirt");
      });
      if (tee) {
        handleSelectProduct(tee);
        addToast("Switched to Heavyweight T-Shirt Drop!", "info");
      }
    } else if (type === "hoodie") {
      const hoodie = products.find((p) => {
        const t = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
        return t.includes("hoodie") || t.includes("sweatshirt");
      });
      if (hoodie) {
        handleSelectProduct(hoodie);
        addToast("Switched to Heavyweight Hoodie Drop!", "info");
      }
    } else if (type === "cargo") {
      const cargo = products.find((p) => {
        const t = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
        return t.includes("cargo") || t.includes("pant");
      });
      if (cargo) {
        handleSelectProduct(cargo);
        addToast("Switched to Parachute Cargos Drop!", "info");
      }
    }
  };

  // Save changes
  const handleSave = () => {
    setSaving(true);
    const success = saveHeroSpotlightConfig(config);
    setTimeout(() => {
      setSaving(false);
      if (success) {
        addToast("Hero Spotlight Card updated live on Home Page!", "success");
      } else {
        addToast("Failed to save Hero Spotlight configuration", "error");
      }
    }, 200);
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm("Reset Hero Spotlight card to default Heavyweight Hoodie?")) {
      resetHeroSpotlightConfig();
      setConfig(getHeroSpotlightConfig());
      setCategoryFilter("all");
      setSearchTerm("");
      addToast("Hero Spotlight reset to default configuration.", "info");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white shadow-xs">
              <Flame size={16} className="text-amber-400 fill-amber-400" />
            </span>
            <h1
              className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Hero Spotlight Drop
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-2xl">
            Control which drop (T-Shirt, Hoodie, or Cargos) appears in the prominent Hero Bento Card on your storefront. Changes reflect immediately!
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw size={14} />
            Reset Default
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Check size={15} strokeWidth={3} className="text-emerald-400" />
            <span>{saving ? "Saving Changes..." : "Save & Publish Live"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Settings & Product Picker (Left 7 Cols) + Live Preview (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Product Selector */}
        <div className="lg:col-span-7 space-y-6">

          {/* Quick Preset Selector Buttons */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs">
            <span className="text-xs font-black uppercase tracking-wider text-gray-900 block mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[var(--color-primary)]" />
              1-Click Fast Switchers
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickPreset("tee")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  config.targetCategory === "tee"
                    ? "border-[var(--color-primary)] bg-blue-50/60 ring-2 ring-[var(--color-primary)]/20 shadow-xs"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100/80"
                }`}
              >
                <span className="text-xl mb-1">👕</span>
                <span className="text-xs font-black uppercase text-gray-900">Oversized Tee</span>
                <span className="text-[10px] text-gray-500 font-semibold mt-0.5">240-280 GSM</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset("hoodie")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  config.targetCategory === "hoodie"
                    ? "border-[var(--color-primary)] bg-blue-50/60 ring-2 ring-[var(--color-primary)]/20 shadow-xs"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100/80"
                }`}
              >
                <span className="text-xl mb-1">🧥</span>
                <span className="text-xs font-black uppercase text-gray-900">Heavy Hoodie</span>
                <span className="text-[10px] text-gray-500 font-semibold mt-0.5">380-400 GSM</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset("cargo")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  config.targetCategory === "cargo"
                    ? "border-[var(--color-primary)] bg-blue-50/60 ring-2 ring-[var(--color-primary)]/20 shadow-xs"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100/80"
                }`}
              >
                <span className="text-xl mb-1">👖</span>
                <span className="text-xs font-black uppercase text-gray-900">Parachute Cargos</span>
                <span className="text-[10px] text-gray-500 font-semibold mt-0.5">Tactical Fit</span>
              </button>
            </div>
          </div>

          {/* Product Selection List */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                  Select Product Drop from Inventory
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click any product below to link it to the Hero Showcase
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                {filteredProducts.length} drops available
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name, category, or collection (e.g. Tee, Hoodie, Acid)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Scrollable Product Picker */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct?._id === p._id;
                const thumb =
                  p.variants?.find((v) => v.images && v.images.length > 0)?.images?.[0] ||
                  p.image ||
                  "/models/model1.png";
                const price = p.variants?.[0]?.salePrice || p.variants?.[0]?.price || 0;

                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className={`w-full pt-2 flex items-center justify-between gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <img
                          src={thumb}
                          alt={p.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/models/model1.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black uppercase text-gray-900 truncate">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-extrabold text-[var(--color-primary)]">
                            ₹{price}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase truncate">
                            {p.brand || "GENZ ORIGINALS"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-xs">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-gray-400 uppercase group-hover:text-gray-900">
                          Select
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Badges & Typography Controls */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
              Card Content & Taglines
            </h3>

            {/* Badge Text */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
                Top Badge Text (e.g. HEAVYWEIGHT 240 GSM TEE)
              </label>
              <input
                type="text"
                value={config.badgeText}
                onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                placeholder="HEAVYWEIGHT 380 GSM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-900 uppercase focus:bg-white focus:border-gray-900 focus:outline-none"
              />
              {/* Preset Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {BADGE_PRESETS.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => setConfig({ ...config, badgeText: badge })}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Subtitle */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                placeholder="Drop shoulder & double-needle ribbed hem."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
              />
            </div>

            {/* Tag Pill & Price Override */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
                  Corner Pill Tag
                </label>
                <input
                  type="text"
                  value={config.tagPill}
                  onChange={(e) => setConfig({ ...config, tagPill: e.target.value })}
                  placeholder="Signature Fit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-900 uppercase focus:bg-white focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">
                  Price Override (Optional)
                </label>
                <input
                  type="number"
                  value={config.customPrice}
                  onChange={(e) => setConfig({ ...config, customPrice: e.target.value })}
                  placeholder={String(previewPrice)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Bento Card Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                Live Storefront Card Preview
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Home Hero Bento #3
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4 font-medium">
              This is the exact dark bento card customers will see in the hero section:
            </p>

            {/* Exact Bento Card 3 Replica */}
            <div className="relative bg-[#0E0F12] text-white rounded-[28px] border border-neutral-800 p-5 shadow-xl flex items-center justify-between gap-4 overflow-hidden">
              {/* Subtle background glow */}
              <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-red-600/15 filter blur-2xl" />

              <div className="flex flex-col justify-between h-full space-y-2 min-w-0 flex-1 z-10">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[10px] font-black uppercase tracking-wider mb-1.5">
                    {config.badgeText || "HEAVYWEIGHT 380 GSM"}
                  </span>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors truncate">
                    {previewTitle}
                  </h2>
                  <p className="text-xs text-neutral-400 font-medium line-clamp-1 mt-0.5">
                    {config.subtitle || "Drop shoulder & ribbed hem"}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm font-black text-amber-400">
                    ₹{previewPrice}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {config.tagPill || "Signature Fit"}
                  </span>
                </div>
              </div>

              {/* Preview Thumbnail + Arrow Badge */}
              <div className="flex items-center gap-3 shrink-0 z-10">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-neutral-900 border border-neutral-700/80 overflow-hidden p-1 flex items-center justify-center">
                  <img
                    src={previewImage}
                    alt={previewTitle}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/models/model1.png";
                    }}
                  />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Linked Product Metadata */}
            {selectedProduct && (
              <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Linked Product ID:</span>
                  <span className="font-mono text-[11px] text-[var(--color-primary)]">
                    {selectedProduct._id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Inventory Stock:</span>
                  <span className="font-bold text-emerald-600">
                    {selectedProduct.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0} in stock
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Destination URL:</span>
                  <span className="font-mono text-[10px] text-gray-500">
                    /products/{selectedProduct._id}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="mt-4 w-full py-3 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Check size={16} strokeWidth={3} className="text-emerald-400" />
              <span>Publish This Drop To Hero</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroShowcaseEdit;
