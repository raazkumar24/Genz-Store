<<<<<<< HEAD
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import { Card, BackButton } from "../components/ui";
import { 
  Flame, 
  Layers, 
  Clock, 
  Copy, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Zap, 
  ChevronDown, 
  ChevronUp
} from "lucide-react";
import ProductFilters, { applyProductFilters } from "../components/ProductFilters";

const ProductSkeleton = () => (
  <Card className="animate-pulse p-4 rounded-2xl md:rounded-[28px] bg-white border border-neutral-100 shadow-2xs">
=======
import React, { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { Badge, Card, BackButton } from "../components/ui";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import ProductFilters, { applyProductFilters } from "../components/ProductFilters";

const ProductSkeleton = () => (
  <Card className="animate-pulse p-4 rounded-2xl md:rounded-[28px] bg-white border border-neutral-100">
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
    <div className="aspect-square md:aspect-[4/5] w-full rounded-xl md:rounded-[20px] bg-neutral-200" />
    <div className="mt-4 space-y-3">
      <div className="h-4 w-3/4 rounded bg-neutral-200" />
      <div className="h-3 w-1/2 rounded bg-neutral-200" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-20 rounded bg-neutral-200" />
        <div className="h-8 w-24 rounded-full bg-neutral-200" />
      </div>
    </div>
  </Card>
);

const initialFilters = {
  searchQuery: "",
  category: "all",
  gender: "all",
  priceRange: "all",
  size: "all",
  color: "all",
  inStockOnly: false,
  onSaleOnly: true,
  sortBy: "latest",
};

<<<<<<< HEAD
// Exclusive coupon cards data
const COUPONS = [
  {
    code: "SUMMER20",
    discount: "EXTRA 20% OFF",
    condition: "Min Order ₹1,499",
    tag: "MOST POPULAR",
    badgeColor: "bg-red-500 text-white",
  },
  {
    code: "BLOWOUT500",
    discount: "FLAT ₹500 OFF",
    condition: "Min Order ₹2,499",
    tag: "HIGH CART VALUE",
    badgeColor: "bg-orange-500 text-white",
  },
  {
    code: "FREESHIP",
    discount: "FREE EXPRESS SHIPPING",
    condition: "All Prepaid Orders",
    tag: "ZERO SHIPPING",
    badgeColor: "bg-neutral-900 text-white",
  },
];

const FAQS = [
  {
    q: "Can I exchange or return items bought during the Summer Blowout?",
    a: "Yes! All Summer Blowout clearance drops come with our standard 14-day doorstep exchange and return guarantee for size or defect concerns.",
  },
  {
    q: "How do I apply the extra discount coupon codes?",
    a: "Simply click 'Copy Code' on any coupon card above, and paste it into the coupon box at checkout or in your shopping cart before payment.",
  },
  {
    q: "Are clearance products 100% authentic and first-quality?",
    a: "Absolutely. All items in the Summer Blowout are original 280+ GSM heavyweight cotton archival drops and seasonal excess inventory directly from our main collection.",
  },
  {
    q: "How fast will my Summer Blowout order be delivered?",
    a: "Blowout orders are dispatched via Express Courier within 24–48 hours with standard delivery within 3–5 business days across India.",
  },
];

const Sale = () => {
  const { products, loading } = useProducts();
  const { addToast } = useToast();
  const [filters, setFilters] = useState(initialFilters);
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Live Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 2, hours: 12, minutes: 30, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter base sale products from full inventory with fallback
  const baseSaleProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const saleList = products.filter((p) => {
      const hasSaleVariant = p.variants?.some((v) => v.isSale || (v.salePrice && v.salePrice > 0));
      return hasSaleVariant || p.isSale;
    });
    // Fallback: If no products have isSale flag set yet in DB, show all catalog drops as eligible deals
    return saleList.length > 0 ? saleList : products;
=======
const Sale = () => {
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState(initialFilters);

  const baseSaleProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const hasSaleVariant = p.variants?.some((v) => v.isSale || (v.salePrice && v.salePrice > 0));
      return hasSaleVariant || p.isSale;
    });
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
  }, [products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
<<<<<<< HEAD
    setActiveTab("all");
  };

  // Quick Curated Deal Filter Tabs
  const handleQuickTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "all") {
      setFilters((prev) => ({ ...prev, category: "all", priceRange: "all", onSaleOnly: true }));
    } else if (tabKey === "under999") {
      setFilters((prev) => ({ ...prev, category: "all", priceRange: "under-999" }));
    } else if (tabKey === "tees") {
      setFilters((prev) => ({ ...prev, category: "oversized-tees", priceRange: "all" }));
    } else if (tabKey === "cargos") {
      setFilters((prev) => ({ ...prev, category: "cargos", priceRange: "all" }));
    } else if (tabKey === "hoodies") {
      setFilters((prev) => ({ ...prev, category: "hoodies", priceRange: "all" }));
    } else if (tabKey === "steals") {
      setFilters((prev) => ({ ...prev, sortBy: "discount-desc" }));
    }
=======
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
  };

  const filteredProducts = useMemo(() => {
    return applyProductFilters(baseSaleProducts, { ...filters, onSaleOnly: false });
  }, [baseSaleProducts, filters]);

<<<<<<< HEAD
  // Copy Coupon Code Handler
  const handleCopyCoupon = (code) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      if (addToast) {
        addToast(`Coupon code ${code} copied to clipboard!`, "success", "copy");
      }
      setTimeout(() => {
        setCopiedCode((curr) => (curr === code ? null : curr));
      }, 3000);
    } catch {
      // Fallback
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0E0E10] text-neutral-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Dynamic Animated Marquee Banner */}
      <div className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white text-[11px] md:text-xs font-black uppercase tracking-widest py-2.5 px-4 overflow-hidden border-b border-red-500/30">
        <div className="flex items-center justify-center gap-6 whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-1.5">
            <Flame size={14} className="fill-white animate-pulse" /> SUMMER BLOWOUT LIVE — UP TO 60% OFF
          </span>
          <span className="text-white/60">•</span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="fill-yellow-300 text-yellow-300" /> USE CODE 'SUMMER20' FOR EXTRA 20% OFF
          </span>
          <span className="text-white/60">•</span>
          <span className="flex items-center gap-1.5">
            <Truck size={14} /> FREE EXPRESS DISPATCH ON ORDERS ₹1,499+
          </span>
          <span className="text-white/60">•</span>
          <span className="flex items-center gap-1.5">
            <RotateCcw size={14} /> 14-DAY DOORSTEP EXCHANGES
          </span>
        </div>
      </div>

      {/* Hero Section with Streetwear Glow */}
      <section className="relative overflow-hidden pt-6 pb-12 md:pt-10 md:pb-16 border-b border-neutral-800">
        {/* Ambient Neon Background Glows */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.18),transparent_70%)]" />
        <div className="pointer-events-none absolute -top-24 right-10 w-72 h-72 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          {/* Navigation & Back button */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2">
              <BackButton size="sm" className="bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800" />
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider hidden sm:inline">
                Home / Clearance Hub
              </span>
            </div>

            <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 rounded-full px-3.5 py-1.5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider text-red-400">
                Live Archival Drop
              </span>
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 text-red-400 text-xs font-black uppercase tracking-widest shadow-inner">
              <Flame size={15} className="text-red-500 fill-red-500 animate-bounce" />
              Limited Archival Inventory
            </div>

            <h1
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-tight break-words max-w-full"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Summer{" "}
              <span className="text-outline-red ml-1">
                Blowout
              </span>
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Grab heavily discounted drops on heavyweight 280+ GSM cotton tees, baggy cargos, and archival fits. Once sold out, they will not restock.
            </p>

            {/* Flash Sale Live Countdown Timer */}
            <div className="pt-3 flex flex-col items-center">
              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 mb-3">
                <Clock size={14} className="text-red-500" /> Flash Deals Expire In
              </p>
              
              <div className="flex items-center gap-2 sm:gap-3 font-mono">
                {/* Days */}
                <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl min-w-[58px] sm:min-w-[68px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Days</span>
                </div>
                <span className="text-xl font-bold text-neutral-600">:</span>

                {/* Hours */}
                <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl min-w-[58px] sm:min-w-[68px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Hours</span>
                </div>
                <span className="text-xl font-bold text-neutral-600">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl min-w-[58px] sm:min-w-[68px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mins</span>
                </div>
                <span className="text-xl font-bold text-neutral-600">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center bg-red-950/50 border border-red-800/80 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl min-w-[58px] sm:min-w-[68px] shadow-lg">
                  <span className="text-xl sm:text-2xl font-black text-red-400 animate-pulse">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-red-400 uppercase tracking-wider">Secs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Coupon Code Cards Section */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {COUPONS.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className="relative group overflow-hidden rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-red-500/50 p-4 sm:p-5 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${coupon.badgeColor}`}>
                      {coupon.tag}
                    </span>
                    <span className="text-[11px] font-bold text-neutral-400">
                      {coupon.condition}
                    </span>
                  </div>

                  <h4 className="text-lg font-black uppercase text-white tracking-tight">
                    {coupon.discount}
                  </h4>

                  <div className="mt-3 flex items-center justify-between gap-2 p-2 rounded-xl bg-black/60 border border-neutral-800 border-dashed">
                    <span className="font-mono text-sm font-black tracking-widest text-red-400 pl-2">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-black hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} strokeWidth={3} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <section className="relative z-10 mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 w-full flex-grow">
        {/* Curated Deal Quick Filters Pills */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { key: "all", label: "🔥 All Blowout Deals", count: baseSaleProducts.length },
            { key: "under999", label: "⚡ Under ₹999 Steals" },
            { key: "tees", label: "👕 Oversized Tees" },
            { key: "cargos", label: "👖 Baggy Cargos" },
            { key: "hoodies", label: "🧥 Heavyweight Hoodies" },
            { key: "steals", label: "💥 50%+ Off Mega Deals" },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleQuickTabSelect(tab.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30 scale-102"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
=======
  return (
    <div className="relative w-full min-h-screen bg-[#FBFBFA] flex flex-col pt-4 md:pt-8">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-3 py-4 md:py-8 md:px-8 w-full">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton size="sm" />
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <Badge
            variant="error"
            className="px-3.5 py-1 flex items-center gap-2 text-white text-xs font-black uppercase tracking-wider"
          >
            <Flame size={14} className="fill-white animate-pulse" />
            Clearance Flash Deals
          </Badge>

          <h2
            className="mt-4 text-3xl font-black uppercase tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Clearance <span className="text-red-500">Sale</span>
          </h2>

          <p className="mt-3 max-w-xl text-xs sm:text-sm font-medium text-neutral-600 md:text-base">
            Cop these fits before they're gone forever. Heavy discounts on seasonal drops and limited archival inventory.
          </p>

          {/* Quick Categories Bar */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/collections/oversized-tees" className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs">
              Oversized Tees
            </Link>
            <Link to="/collections/cargos" className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs">
              Cargos
            </Link>
            <Link to="/new-arrivals" className="px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[var(--color-primary)] transition shadow-2xs">
              Fresh Drops
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-6">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
            showCategoryTabs={true}
          />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
        </div>

        {/* Global Filter Toolbar with Dark Theme Styling */}
        <div className="mb-8 p-1 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-md">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
            showCategoryTabs={true}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
<<<<<<< HEAD
          <Card className="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-neutral-900 border border-neutral-800 p-8 shadow-xl">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/60 text-red-400 border border-red-800/40">
              <Flame size={28} />
            </div>
            <h3
              className="text-xl font-black text-white uppercase tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No deals found matching your selected filters
            </h3>
            <p className="mt-2 max-w-sm text-xs text-neutral-400 font-medium">
              Try adjusting your active size, price, or category filter to discover more Summer Blowout steals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full border border-neutral-700 text-xs font-black uppercase text-white hover:bg-neutral-800 transition"
              >
                Reset All Filters
              </button>
              <Link
                to="/new-arrivals"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider hover:bg-red-500 transition shadow-md shadow-red-600/30"
              >
                Shop Fresh Drops
=======
          <Card className="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-white border border-neutral-200 p-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Flame size={28} />
            </div>
            <h3
              className="text-xl font-black text-neutral-900 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No active sale deals matching filters
            </h3>
            <p className="mt-2 max-w-sm text-xs text-neutral-500 font-medium">
              Try adjusting your active filters or clear them to see all clearance items.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-black uppercase text-neutral-800 hover:bg-neutral-100"
              >
                Reset Filters
              </button>
              <Link to="/new-arrivals" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-neutral-900 text-white font-black text-xs uppercase tracking-wider hover:bg-[var(--color-primary)] transition shadow-sm">
                Shop New Arrivals
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Streetwear Quality Guarantee Section */}
      <section className="border-t border-neutral-800 bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-2.5 rounded-xl bg-red-950/60 text-red-400 border border-red-800/30 shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-white">280+ GSM Combed Cotton</h5>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Heavyweight luxury drape built for high durability and drop-shoulder streetwear fit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-2.5 rounded-xl bg-red-950/60 text-red-400 border border-red-800/30 shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-white">24-48h Express Dispatch</h5>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Fast priority handling with live tracking straight to your doorstep across India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-2.5 rounded-xl bg-red-950/60 text-red-400 border border-red-800/30 shrink-0">
              <RotateCcw size={22} />
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-white">14-Day Exchanges</h5>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Hassle-free doorstep exchanges and returns for total peace of mind on clearance items.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-2.5 rounded-xl bg-red-950/60 text-red-400 border border-red-800/30 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-white">100% Original Brand</h5>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Authentic certified Gen Z streetwear with original neck tags and verified branding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Summer Blowout FAQ Accordion */}
      <section className="border-t border-neutral-800/80 bg-[#0E0E10] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Summer Blowout <span className="text-outline-red ml-1">FAQ</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-2 font-medium">
              Everything you need to know about discounts, dispatch, and coupons.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-neutral-900/70 border border-neutral-800 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold uppercase text-white tracking-wide">
                      {faq.q}
                    </span>
                    <span className="text-neutral-400 shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-neutral-400 font-normal leading-relaxed border-t border-neutral-800/60 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sale;
