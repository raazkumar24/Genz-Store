import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  RotateCcw,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
  Check,
} from "lucide-react";

// Standard Streetwear Color Options with Hex codes
export const FILTER_COLORS = [
  { name: "Black", hex: "#111111", border: "border-neutral-900" },
  { name: "White", hex: "#FFFFFF", border: "border-neutral-300" },
  { name: "Gray", hex: "#6B7280", border: "border-neutral-400" },
  { name: "Beige", hex: "#F5F5DC", border: "border-neutral-300" },
  { name: "Olive", hex: "#4D7C0F", border: "border-neutral-600" },
  { name: "Blue", hex: "#1E3A8A", border: "border-blue-800" },
  { name: "Red", hex: "#EF4444", border: "border-red-500" },
  { name: "Brown", hex: "#92400E", border: "border-amber-900" },
];

export const FILTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const PRICE_PRESETS = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-999", label: "Under ₹999", min: 0, max: 999 },
  { id: "999-1499", label: "₹999 - ₹1,499", min: 999, max: 1499 },
  { id: "1500-2499", label: "₹1,500 - ₹2,499", min: 1500, max: 2499 },
  { id: "2500-plus", label: "₹2,500+", min: 2500, max: Infinity },
];

export const CATEGORY_TABS = [
  { id: "all", label: "All Drops" },
  { id: "oversized-tees", label: "Oversized Tees" },
  { id: "hoodies", label: "Hoodies" },
  { id: "cargos", label: "Cargos & Bottoms" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
];

export const SORT_OPTIONS = [
  { id: "latest", label: "Latest Drops (Newest)" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
  { id: "discount-desc", label: "Biggest Discount %" },
];

export const COLOR_FAMILIES = {
  red: ["red", "wine", "crimson", "maroon", "burgundy", "ruby", "scarlet"],
  brown: ["brown", "coffee", "mocha", "chocolate", "espresso"],
  white: ["white", "swanwhite", "ivory", "snow"],
  blue: ["blue", "sky", "navy", "cobalt", "cyan", "teal", "indigo"],
  black: ["black", "noir", "dark", "jet", "pitch"],
  grey: ["grey", "gray", "charcoal", "slate", "ash", "silver"],
  gray: ["grey", "gray", "charcoal", "slate", "ash", "silver"],
  beige: ["beige", "cream", "khaki", "sand", "tan", "nude"],
  green: ["green", "olive", "sage", "forest", "emerald", "lime"],
  orange: ["orange", "rust", "tangerine", "peach"],
  yellow: ["yellow", "mustard", "amber", "gold"],
  purple: ["purple", "lavender", "violet", "lilac"],
  pink: ["pink", "rose", "fuchsia", "magenta"],
};

export const matchesColorFamily = (vColor, target) => {
  if (!vColor || !target) return false;
  const v = String(vColor).toLowerCase().trim();
  const t = String(target).toLowerCase().trim();
  if (v === t || v.includes(t) || t.includes(v)) return true;

  const familyKeywords = COLOR_FAMILIES[t];
  if (familyKeywords && familyKeywords.some((kw) => v.includes(kw))) {
    return true;
  }

  for (const [fam, kws] of Object.entries(COLOR_FAMILIES)) {
    if ((fam === t || kws.includes(t)) && kws.some((kw) => v.includes(kw))) {
      return true;
    }
  }

  const vWords = v.split(/[\s-_]+/);
  const tWords = t.split(/[\s-_]+/);
  return (
    vWords.some((vw) => tWords.includes(vw)) ||
    tWords.some((tw) => vWords.includes(tw))
  );
};

/**
 * Filter Engine: Filters and sorts products based on the filter state
 */
export const applyProductFilters = (products = [], filters = {}) => {
  if (!products || !Array.isArray(products)) return [];

  const {
    searchQuery = "",
    category = "all",
    gender = "all",
    priceRange = "all",
    minPrice = 0,
    maxPrice = Infinity,
    size = "all",
    color = "all",
    inStockOnly = false,
    onSaleOnly = false,
    sortBy = "latest",
  } = filters;

  let result = products.filter((product) => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchedVariant = product.variants?.some((v) => {
        const vText = [v.color, v.size, ...(v.keywords || [])]
          .join(" ")
          .toLowerCase();
        return vText.includes(q);
      });

      const pText = [
        product.name,
        product.description,
        product.gender,
        product.brand,
        Array.isArray(product.collection)
          ? product.collection.join(" ")
          : product.collection,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!pText.includes(q) && !matchedVariant) return false;
    }

    // 2. Category / Silhouette Filter
    if (category && category !== "all") {
      const catLower = category.toLowerCase().trim();
      const collections = Array.isArray(product.collection)
        ? product.collection.map((c) => String(c).toLowerCase())
        : [String(product.collection || "").toLowerCase()];
      const pGender = String(product.gender || "").toLowerCase();
      const pName = String(product.name || "").toLowerCase();

      let match = false;
      if (catLower === "women" || catLower === "womens") {
        // Exclude strictly Men items
        const isExplicitMenTitle =
          /\b(men|man|mens|men's|mans)\b/i.test(pName) &&
          !/\b(women|woman|womens|women's)\b/i.test(pName);
        if (pGender !== "men" && !isExplicitMenTitle) {
          const hasWomenCollection = collections.some(
            (c) =>
              c === "women" ||
              c === "womens" ||
              c === "womenswear" ||
              c === "female",
          );
          const hasWomenInName = /\b(women|woman|womens|women's)\b/i.test(pName);
          if (pGender === "women" || hasWomenCollection || hasWomenInName) {
            match = true;
          }
        }
      } else if (catLower === "men" || catLower === "mens") {
        // Exclude strictly Women items
        const isExplicitWomenTitle =
          /\b(women|woman|womens|women's)\b/i.test(pName);
        if (pGender !== "women" && !isExplicitWomenTitle) {
          const hasMenCollection = collections.some(
            (c) =>
              c === "men" ||
              c === "mens" ||
              c === "menswear" ||
              c === "male",
          );
          const hasMenInName = /\b(men|man|mens|men's|mans)\b/i.test(pName);
          if (
            pGender === "men" ||
            pGender === "unisex" ||
            hasMenCollection ||
            hasMenInName
          ) {
            match = true;
          }
        }
      } else if (catLower.includes("oversized") || catLower.includes("tee")) {
        if (
          collections.some(
            (c) => c.includes("oversized") || c.includes("tee"),
          ) ||
          pName.includes("oversized") ||
          pName.includes("tee")
        )
          match = true;
      } else if (catLower.includes("hoodie") || catLower.includes("sweatshirt")) {
        if (
          collections.some(
            (c) => c.includes("hoodie") || c.includes("sweatshirt"),
          ) ||
          pName.includes("hoodie") ||
          pName.includes("sweatshirt")
        )
          match = true;
      } else if (
        catLower.includes("cargo") ||
        catLower.includes("bottom") ||
        catLower.includes("pant") ||
        catLower.includes("trouser")
      ) {
        if (
          collections.some(
            (c) =>
              c.includes("cargo") ||
              c.includes("baggy") ||
              c.includes("pant") ||
              c.includes("trouser"),
          ) ||
          pName.includes("cargo") ||
          pName.includes("pant") ||
          pName.includes("trouser")
        )
          match = true;
      } else {
        // Exact token match or word boundary to prevent substring bugs like 'women'.includes('men')
        match =
          collections.some((c) => {
            if (c === catLower) return true;
            const cWords = c.split(/[\s-_]+/);
            const catWords = catLower.split(/[\s-_]+/);
            return (
              cWords.some((w) => catWords.includes(w)) ||
              catWords.some((w) => cWords.includes(w))
            );
          }) || pName.includes(catLower.replace(/-/g, " "));
      }

      if (!match) return false;
    }

    // 3. Gender Filter
    if (gender && gender !== "all") {
      const pGender = String(product.gender || "").toLowerCase();
      const targetGender = gender.toLowerCase().trim();
      const pName = String(product.name || "").toLowerCase();
      const collections = Array.isArray(product.collection)
        ? product.collection.map((c) => String(c).toLowerCase())
        : [String(product.collection || "").toLowerCase()];

      if (targetGender === "women" || targetGender === "womens") {
        if (pGender === "men") return false;
        const isExplicitMenTitle =
          /\b(men|man|mens|men's|mans)\b/i.test(pName) &&
          !/\b(women|woman|womens|women's)\b/i.test(pName);
        if (isExplicitMenTitle) return false;
        const hasWomen =
          pGender === "women" ||
          collections.some(
            (c) =>
              c === "women" ||
              c === "womens" ||
              c === "womenswear" ||
              c === "female",
          ) ||
          /\b(women|woman|womens|women's)\b/i.test(pName);
        if (!hasWomen) return false;
      } else if (targetGender === "men" || targetGender === "mens") {
        if (pGender === "women") return false;
        const isExplicitWomenTitle =
          /\b(women|woman|womens|women's)\b/i.test(pName);
        if (isExplicitWomenTitle) return false;
        const hasMen =
          pGender === "men" ||
          pGender === "unisex" ||
          collections.some(
            (c) =>
              c === "men" ||
              c === "mens" ||
              c === "menswear" ||
              c === "male",
          ) ||
          /\b(men|man|mens|men's|mans)\b/i.test(pName);
        if (!hasMen) return false;
      } else {
        if (pGender !== "unisex" && pGender !== targetGender) return false;
      }
    }

    // 4. Price Filter
    let effectivePrice = product.price || 0;
    const saleVar = product.variants?.find((v) => v.isSale && v.salePrice > 0);
    if (saleVar) {
      effectivePrice = saleVar.salePrice;
    } else if (product.variants?.[0]?.price) {
      effectivePrice = product.variants[0].price;
    }

    let min = 0;
    let max = Infinity;

    if (priceRange !== "all") {
      const preset = PRICE_PRESETS.find((p) => p.id === priceRange);
      if (preset) {
        min = preset.min;
        max = preset.max;
      }
    } else {
      if (minPrice > 0) min = minPrice;
      if (maxPrice && maxPrice < Infinity) max = maxPrice;
    }

    if (effectivePrice < min || effectivePrice > max) return false;

    // 5. Size Filter
    if (size && size !== "all") {
      const hasSize = product.variants?.some((v) => {
        const vSize = String(v.size || "").toUpperCase();
        return (
          vSize === size.toUpperCase() && (inStockOnly ? v.stock > 0 : true)
        );
      });
      if (!hasSize) return false;
    }

    // 6. Color Filter
    if (color && color !== "all") {
      const hasColor = product.variants?.some((v) =>
        matchesColorFamily(v.color, color),
      );
      if (!hasColor) return false;
    }

    // 7. In-Stock Only Filter
    if (inStockOnly) {
      const hasStock =
        (product.variants || []).some((v) => v.stock > 0) ||
        (product.stock && product.stock > 0);
      if (!hasStock) return false;
    }

    // 8. On-Sale Only Filter
    if (onSaleOnly) {
      const hasSale =
        (product.variants || []).some(
          (v) => v.isSale || (v.salePrice && v.salePrice > 0),
        ) || product.isSale;
      if (!hasSale) return false;
    }

    return true;
  });

  // Attach the best-matched variant to each product for display (e.g. chosen color/size/sale)
  result = result.map((product) => {
    if (!product.variants || product.variants.length === 0) return product;

    let targetVariant = null;

    // Helper for fuzzy color match
    const matchesColor = (vColor, target) => matchesColorFamily(vColor, target);

    // 1. If color filter is active (highest visual priority)
    if (color && color !== "all") {
      // If both size and color filters are selected
      if (size && size !== "all") {
        const sTarget = size.toUpperCase().trim();
        targetVariant =
          product.variants.find((v) => {
            const vSize = String(v.size || "")
              .toUpperCase()
              .trim();
            return (
              matchesColor(v.color, color) &&
              vSize === sTarget &&
              (inStockOnly ? v.stock > 0 : true)
            );
          }) ||
          product.variants.find((v) => {
            const vSize = String(v.size || "")
              .toUpperCase()
              .trim();
            return matchesColor(v.color, color) && vSize === sTarget;
          });
      }

      // If no combo match found, find by color
      if (!targetVariant) {
        targetVariant =
          product.variants.find((v) => {
            return (
              matchesColor(v.color, color) && (inStockOnly ? v.stock > 0 : true)
            );
          }) || product.variants.find((v) => matchesColor(v.color, color));
      }
    }
    // 2. If size filter is active without color filter
    else if (size && size !== "all") {
      const sTarget = size.toUpperCase().trim();
      targetVariant =
        product.variants.find((v) => {
          const vSize = String(v.size || "")
            .toUpperCase()
            .trim();
          return vSize === sTarget && (inStockOnly ? v.stock > 0 : true);
        }) ||
        product.variants.find((v) => {
          const vSize = String(v.size || "")
            .toUpperCase()
            .trim();
          return vSize === sTarget;
        });
    }
    // 3. If search query is active
    else if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      targetVariant =
        product.variants.find((v) => {
          const vText = [v.color, v.size, ...(v.keywords || [])]
            .join(" ")
            .toLowerCase();
          return vText.includes(q) && (inStockOnly ? v.stock > 0 : true);
        }) ||
        product.variants.find((v) => {
          const vText = [v.color, v.size, ...(v.keywords || [])]
            .join(" ")
            .toLowerCase();
          return vText.includes(q);
        });
    }
    // 4. If on-sale filter is active
    else if (onSaleOnly) {
      targetVariant =
        product.variants.find((v) => {
          return (
            (v.isSale || (v.salePrice && v.salePrice > 0)) &&
            (inStockOnly ? v.stock > 0 : true)
          );
        }) ||
        product.variants.find(
          (v) => v.isSale || (v.salePrice && v.salePrice > 0),
        );
    }

    // Default fallback: in-stock variant or first variant
    if (!targetVariant) {
      targetVariant = inStockOnly
        ? product.variants.find((v) => v.stock > 0) || product.variants[0]
        : product.variants.find((v) => v.stock > 0) || product.variants[0];
    }

    return {
      ...product,
      matchedVariant: targetVariant,
      displayVariant: targetVariant,
    };
  });

  // Sorting
  if (sortBy === "price-asc") {
    result.sort((a, b) => {
      const priceA =
        a.displayVariant?.isSale && a.displayVariant?.salePrice
          ? a.displayVariant.salePrice
          : a.displayVariant?.price || a.price || 0;
      const priceB =
        b.displayVariant?.isSale && b.displayVariant?.salePrice
          ? b.displayVariant.salePrice
          : b.displayVariant?.price || b.price || 0;
      return priceA - priceB;
    });
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => {
      const priceA =
        a.displayVariant?.isSale && a.displayVariant?.salePrice
          ? a.displayVariant.salePrice
          : a.displayVariant?.price || a.price || 0;
      const priceB =
        b.displayVariant?.isSale && b.displayVariant?.salePrice
          ? b.displayVariant.salePrice
          : b.displayVariant?.price || b.price || 0;
      return priceB - priceA;
    });
  } else if (sortBy === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "discount-desc") {
    result.sort((a, b) => {
      const getDisc = (p) => {
        const v = p.displayVariant || p.variants?.[0];
        if (v && v.isSale && v.price && v.salePrice) {
          return (v.price - v.salePrice) / v.price;
        }
        return 0;
      };
      return getDisc(b) - getDisc(a);
    });
  }

  return result;
};

const ProductFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  products: _products = [],
  totalResults = 0,
  showCategoryTabs = true,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== "all") count++;
    if (filters.gender && filters.gender !== "all") count++;
    if (filters.priceRange && filters.priceRange !== "all") count++;
    if (
      filters.minPrice > 0 ||
      (filters.maxPrice && filters.maxPrice < Infinity)
    )
      count++;
    if (filters.size && filters.size !== "all") count++;
    if (filters.color && filters.color !== "all") count++;
    if (filters.inStockOnly) count++;
    if (filters.onSaleOnly) count++;
    if (filters.sortBy && filters.sortBy !== "latest") count++;
    return count;
  }, [filters]);

  const removeFilter = (key, defaultValue = "all") => {
    onFilterChange({ ...filters, [key]: defaultValue });
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Top Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
        {/* Left: Category Navigation Tabs (Sharp Rectangles matching Image 3) */}
        {showCategoryTabs && (
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = (filters.category || "all") === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    onFilterChange({ ...filters, category: tab.id })
                  }
                  className={`px-4 py-2 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-black text-white shadow-xs"
                      : "bg-[#F4F4F0] text-neutral-700 hover:bg-neutral-200 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Actions: Showing Count + Filter Button + Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 hidden md:inline">
            SHOWING {totalResults} SILHOUETTES
          </span>

          {/* Quick Filters Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeFilterCount > 0
                ? "bg-black text-white border-black"
                : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
            }`}
          >
            <SlidersHorizontal size={12} strokeWidth={2.4} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-none bg-[#FF3B00] px-1 text-[10px] font-black text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center shrink-0">
            <ArrowUpDown
              size={12}
              className="absolute left-3 text-neutral-400 pointer-events-none"
            />
            <select
              value={filters.sortBy || "latest"}
              onChange={(e) =>
                onFilterChange({ ...filters, sortBy: e.target.value })
              }
              className="appearance-none rounded-none bg-white pl-8 pr-7 py-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 border border-neutral-300 focus:outline-none focus:border-black cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 text-neutral-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mr-1">
            Active:
          </span>

          {filters.category && filters.category !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold uppercase">
              {filters.category.replace("-", " ")}
              <button
                type="button"
                onClick={() => removeFilter("category")}
                className="hover:text-red-400 ml-1 cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.priceRange && filters.priceRange !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold uppercase">
              {PRICE_PRESETS.find((p) => p.id === filters.priceRange)?.label ||
                "Price"}
              <button
                type="button"
                onClick={() => removeFilter("priceRange")}
                className="hover:text-red-400 ml-1 cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          )}

          {(filters.minPrice > 0 ||
            (filters.maxPrice && filters.maxPrice < Infinity)) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold uppercase">
              ₹{filters.minPrice || 0} - ₹{filters.maxPrice || "Max"}
              <button
                type="button"
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    minPrice: 0,
                    maxPrice: Infinity,
                  });
                }}
                className="hover:text-red-400 ml-1 cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.size && filters.size !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold uppercase">
              Size: {filters.size}
              <button
                type="button"
                onClick={() => removeFilter("size")}
                className="hover:text-red-400 ml-1 cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.color && filters.color !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold uppercase">
              Color: {filters.color}
              <button
                type="button"
                onClick={() => removeFilter("color")}
                className="hover:text-red-400 ml-1 cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold uppercase">
              In Stock
              <button
                type="button"
                onClick={() => removeFilter("inStockOnly", false)}
                className="hover:text-emerald-200 ml-1 cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.onSaleOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold uppercase">
              On Sale
              <button
                type="button"
                onClick={() => removeFilter("onSaleOnly", false)}
                className="hover:text-red-200 ml-1 cursor-pointer"
              >
                <X size={11} strokeWidth={3} />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[var(--color-primary)] hover:underline ml-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Clear All
          </button>
        </div>
      )}

      {/* Filter Modal / Dialog */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-neutral-200 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-neutral-900" />
                  <h3 className="text-base font-black uppercase tracking-wider text-neutral-900">
                    Filter Drops
                  </h3>
                  {totalResults > 0 && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-bold text-neutral-600">
                      {totalResults} items
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Price Presets */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-2.5">
                    Price Range
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PRICE_PRESETS.map((preset) => {
                      const isSelected =
                        (filters.priceRange || "all") === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            onFilterChange({
                              ...filters,
                              priceRange: preset.id,
                              minPrice: 0,
                              maxPrice: Infinity,
                            });
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      Size
                    </h4>
                    {filters.size && filters.size !== "all" && (
                      <button
                        type="button"
                        onClick={() => removeFilter("size")}
                        className="text-[11px] font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {FILTER_SIZES.map((sz) => {
                      const isSelected =
                        (filters.size || "all").toUpperCase() === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            onFilterChange({
                              ...filters,
                              size: isSelected ? "all" : sz,
                            });
                          }}
                          className={`h-10 rounded-xl text-xs font-black transition-all border flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                              : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      Color
                    </h4>
                    {filters.color && filters.color !== "all" && (
                      <button
                        type="button"
                        onClick={() => removeFilter("color")}
                        className="text-[11px] font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {FILTER_COLORS.map((clr) => {
                      const isSelected =
                        (filters.color || "all").toLowerCase() ===
                        clr.name.toLowerCase();
                      return (
                        <button
                          key={clr.name}
                          type="button"
                          onClick={() => {
                            onFilterChange({
                              ...filters,
                              color: isSelected ? "all" : clr.name,
                            });
                          }}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <span
                            className={`h-4 w-4 rounded-full border ${clr.border}`}
                            style={{ backgroundColor: clr.hex }}
                          />
                          <span className="truncate">{clr.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 border-t border-neutral-100 pt-3">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
                    <span className="text-xs font-bold text-neutral-800">
                      In-Stock Drops Only
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(filters.inStockOnly)}
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          inStockOnly: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded accent-neutral-900 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
                    <span className="text-xs font-bold text-neutral-800">
                      On-Sale Drops Only
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(filters.onSaleOnly)}
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          onSaleOnly: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded accent-[var(--color-primary)] cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 border-t border-neutral-200 pt-4">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[var(--color-primary)] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;
