import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  ArrowUpDown, 
  Sparkles, 
  Flame, 
  ChevronDown 
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
        const vText = [v.color, v.size, ...(v.keywords || [])].join(" ").toLowerCase();
        return vText.includes(q);
      });

      const pText = [
        product.name,
        product.description,
        product.gender,
        product.brand,
        Array.isArray(product.collection) ? product.collection.join(" ") : product.collection,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!pText.includes(q) && !matchedVariant) return false;
    }

    // 2. Category / Silhouette Filter
    if (category && category !== "all") {
      const catLower = category.toLowerCase();
      const collections = Array.isArray(product.collection)
        ? product.collection.map((c) => String(c).toLowerCase())
        : [String(product.collection || "").toLowerCase()];
      const pGender = String(product.gender || "").toLowerCase();
      const pName = String(product.name || "").toLowerCase();

      let match = false;
      if (catLower === "men" && (pGender === "men" || pGender === "unisex")) match = true;
      else if (catLower === "women" && (pGender === "women" || pGender === "unisex")) match = true;
      else if (catLower.includes("oversized") || catLower.includes("tee")) {
        if (collections.some((c) => c.includes("oversized") || c.includes("tee")) || pName.includes("oversized") || pName.includes("tee")) match = true;
      } else if (catLower.includes("hoodie")) {
        if (collections.some((c) => c.includes("hoodie") || c.includes("sweatshirt")) || pName.includes("hoodie")) match = true;
      } else if (catLower.includes("cargo") || catLower.includes("bottom")) {
        if (collections.some((c) => c.includes("cargo") || c.includes("baggy") || c.includes("pant")) || pName.includes("cargo") || pName.includes("pant")) match = true;
      } else {
        match = collections.some((c) => c.includes(catLower) || catLower.includes(c)) || pName.includes(catLower.replace(/-/g, " "));
      }

      if (!match) return false;
    }

    // 3. Gender Filter
    if (gender && gender !== "all") {
      const pGender = String(product.gender || "").toLowerCase();
      const targetGender = gender.toLowerCase();
      if (pGender !== "unisex" && pGender !== targetGender) return false;
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
        return vSize === size.toUpperCase() && (inStockOnly ? v.stock > 0 : true);
      });
      if (!hasSize) return false;
    }

    // 6. Color Filter
    if (color && color !== "all") {
      const cTarget = color.toLowerCase();
      const hasColor = product.variants?.some((v) => {
        const vColor = String(v.color || "").toLowerCase();
        return vColor.includes(cTarget) || cTarget.includes(vColor);
      });
      if (!hasColor) return false;
    }

    // 7. In-Stock Only Filter
    if (inStockOnly) {
      const hasStock = (product.variants || []).some((v) => v.stock > 0) || (product.stock && product.stock > 0);
      if (!hasStock) return false;
    }

    // 8. On-Sale Only Filter
    if (onSaleOnly) {
      const hasSale = (product.variants || []).some((v) => v.isSale || (v.salePrice && v.salePrice > 0)) || product.isSale;
      if (!hasSale) return false;
    }

    return true;
  });

  // Sorting
  if (sortBy === "price-asc") {
    result.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "discount-desc") {
    result.sort((a, b) => {
      const discA = (a.variants || []).find((v) => v.isSale && v.price && v.salePrice) ? (a.variants[0].price - a.variants[0].salePrice) / a.variants[0].price : 0;
      const discB = (b.variants || []).find((v) => v.isSale && v.price && v.salePrice) ? (b.variants[0].price - b.variants[0].salePrice) / b.variants[0].price : 0;
      return discB - discA;
    });
  } else {
    // 'latest' default order
  }

  return result;
};

const ProductFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
  showCategoryTabs = true,
  hideCategoryInDrawer = false,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== "all") count++;
    if (filters.gender && filters.gender !== "all") count++;
    if (filters.priceRange && filters.priceRange !== "all") count++;
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
    <div className="w-full space-y-4">
      {/* Top Filter Bar: Category Tabs + Filter Trigger Button + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
        {/* Category Filter Tabs (Horizontal Scrollable) */}
        {showCategoryTabs && (
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = (filters.category || "all") === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onFilterChange({ ...filters, category: tab.id })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Actions: Filters Drawer Button + Quick Sort */}
        <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto justify-between md:justify-end">
          {/* Filter Modal/Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer border ${
              activeFilterCount > 0
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
            }`}
          >
            <SlidersHorizontal size={14} strokeWidth={2.2} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-black text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown size={13} className="absolute left-3 text-neutral-400 pointer-events-none" />
            <select
              value={filters.sortBy || "latest"}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
              className="appearance-none rounded-full bg-white pl-8 pr-7 py-2 text-xs font-black uppercase tracking-wider text-neutral-800 shadow-2xs border border-neutral-200 focus:outline-none focus:border-neutral-900 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar (Shown when any filter is active) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mr-1">
            Active:
          </span>

          {filters.category && filters.category !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 uppercase">
              Drop: {filters.category.replace("-", " ")}
              <button
                type="button"
                onClick={() => removeFilter("category")}
                className="hover:text-[var(--color-primary)] ml-1"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.priceRange && filters.priceRange !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 uppercase">
              {PRICE_PRESETS.find((p) => p.id === filters.priceRange)?.label || "Price Filter"}
              <button
                type="button"
                onClick={() => removeFilter("priceRange")}
                className="hover:text-[var(--color-primary)] ml-1"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.size && filters.size !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 uppercase">
              Size: {filters.size}
              <button
                type="button"
                onClick={() => removeFilter("size")}
                className="hover:text-[var(--color-primary)] ml-1"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.color && filters.color !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 uppercase">
              Color: {filters.color}
              <button
                type="button"
                onClick={() => removeFilter("color")}
                className="hover:text-[var(--color-primary)] ml-1"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.gender && filters.gender !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 uppercase">
              Gender: {filters.gender}
              <button
                type="button"
                onClick={() => removeFilter("gender")}
                className="hover:text-[var(--color-primary)] ml-1"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 uppercase">
              In Stock Only
              <button
                type="button"
                onClick={() => removeFilter("inStockOnly", false)}
                className="hover:text-[var(--color-primary)] ml-1"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          )}

          {filters.onSaleOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600 uppercase">
              On Sale Only
              <button
                type="button"
                onClick={() => removeFilter("onSaleOnly", false)}
                className="hover:text-[var(--color-primary)] ml-1"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[var(--color-primary)] hover:underline ml-2 cursor-pointer"
          >
            <RotateCcw size={12} /> Reset All
          </button>
        </div>
      )}

      {/* Filter Bottom Sheet / Side Drawer for Mobile & Desktop */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 p-5 bg-white">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <SlidersHorizontal size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-neutral-900">
                      Filter Streetwear
                    </h3>
                    <p className="text-[11px] font-bold text-neutral-400">
                      {totalResults} items matching current options
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="text-xs font-black uppercase tracking-wider text-[var(--color-primary)] hover:underline mr-1"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* 1. Sort By Section */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-400 mb-2.5">
                    Sort Order
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = (filters.sortBy || "latest") === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onFilterChange({ ...filters, sortBy: opt.id })}
                          className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold uppercase transition-all ${
                            isSelected
                              ? "bg-neutral-900 text-white shadow-xs"
                              : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Category / Silhouette Section */}
                {!hideCategoryInDrawer && (
                  <div className="pt-4 border-t border-neutral-100">
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-400 mb-2.5">
                      Collection / Fit
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_TABS.map((cat) => {
                        const isSelected = (filters.category || "all") === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => onFilterChange({ ...filters, category: cat.id })}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                              isSelected
                                ? "bg-neutral-900 text-white shadow-xs"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Price Range Presets */}
                <div className="pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-400 mb-2.5">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRICE_PRESETS.map((p) => {
                      const isSelected = (filters.priceRange || "all") === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => onFilterChange({ ...filters, priceRange: p.id })}
                          className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center ${
                            isSelected
                              ? "bg-neutral-900 text-white shadow-xs"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Sizes */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-400">
                      Size
                    </label>
                    {filters.size && filters.size !== "all" && (
                      <button
                        type="button"
                        onClick={() => removeFilter("size")}
                        className="text-[11px] font-bold uppercase text-[var(--color-primary)]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {FILTER_SIZES.map((sz) => {
                      const isSelected = (filters.size || "all") === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => onFilterChange({ ...filters, size: isSelected ? "all" : sz })}
                          className={`h-11 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center border ${
                            isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                              : "bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Colors */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-400">
                      Color Palette
                    </label>
                    {filters.color && filters.color !== "all" && (
                      <button
                        type="button"
                        onClick={() => removeFilter("color")}
                        className="text-[11px] font-bold uppercase text-[var(--color-primary)]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {FILTER_COLORS.map((c) => {
                      const isSelected = (filters.color || "").toLowerCase() === c.name.toLowerCase();
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() =>
                            onFilterChange({
                              ...filters,
                              color: isSelected ? "all" : c.name.toLowerCase(),
                            })
                          }
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                            isSelected
                              ? "border-neutral-900 bg-neutral-100 font-black scale-105"
                              : "border-neutral-200/80 hover:border-neutral-400 bg-white"
                          }`}
                        >
                          <span
                            className={`h-6 w-6 rounded-full border shadow-2xs flex items-center justify-center ${c.border}`}
                            style={{ backgroundColor: c.hex }}
                          >
                            {isSelected && (
                              <Check
                                size={12}
                                className={c.name === "White" ? "text-neutral-900" : "text-white"}
                                strokeWidth={3}
                              />
                            )}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-neutral-700 truncate w-full text-center">
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Gender Selector */}
                <div className="pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-400 mb-2.5">
                    Gender / Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: "All Fits" },
                      { id: "men", label: "Men" },
                      { id: "women", label: "Women" },
                    ].map((g) => {
                      const isSelected = (filters.gender || "all") === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => onFilterChange({ ...filters, gender: g.id })}
                          className={`p-2.5 rounded-xl text-xs font-bold uppercase transition-all text-center ${
                            isSelected
                              ? "bg-neutral-900 text-white shadow-xs"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Special Badges & Toggles */}
                <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">
                    Special Filters
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-500" />
                      <span className="text-xs font-extrabold uppercase text-neutral-900">
                        In Stock Only
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly || false}
                      onChange={(e) =>
                        onFilterChange({ ...filters, inStockOnly: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-neutral-900"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <Flame size={16} className="text-red-500" />
                      <span className="text-xs font-extrabold uppercase text-neutral-900">
                        On Sale Deals Only
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.onSaleOnly || false}
                      onChange={(e) =>
                        onFilterChange({ ...filters, onSaleOnly: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-[var(--color-primary)]"
                    />
                  </label>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-neutral-200 bg-white flex items-center gap-3">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="flex-1 py-3 rounded-full border border-neutral-300 hover:bg-neutral-100 text-xs font-black uppercase tracking-wider text-neutral-800 transition-colors text-center"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-2 py-3 rounded-full bg-neutral-900 hover:bg-[var(--color-primary)] text-xs font-black uppercase tracking-wider text-white shadow-md transition-colors text-center"
                >
                  Show {totalResults} Products
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
