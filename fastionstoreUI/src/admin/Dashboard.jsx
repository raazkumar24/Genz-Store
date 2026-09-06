import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import {
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Tag,
  Boxes,
  Plus,
  Edit,
  ExternalLink,
} from "lucide-react";
import { Card, Badge, Button } from "../components/ui";

const Dashboard = () => {
  const { products, loading, error } = useProducts();

  // Comprehensive analytics calculation
  const stats = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        totalVariants: 0,
        totalStock: 0,
        inventoryValue: 0,
        lowStockProducts: [],
        outOfStockProducts: [],
        saleProductsCount: 0,
        avgDiscount: 0,
        categoryCounts: {},
        genderCounts: { Men: 0, Women: 0, Unisex: 0 },
      };
    }

    let totalVariants = 0;
    let totalStock = 0;
    let inventoryValue = 0;
    const lowStockProducts = [];
    const outOfStockProducts = [];
    let saleProductsCount = 0;
    let totalDiscountPercent = 0;
    let discountItemsCount = 0;
    const categoryCounts = {};
    const genderCounts = { Men: 0, Women: 0, Unisex: 0 };

    products.forEach((p) => {
      // Gender tally
      const g = p.gender || "Men";
      genderCounts[g] = (genderCounts[g] || 0) + 1;

      // Collection / Category tally
      const collections = Array.isArray(p.collection)
        ? p.collection
        : p.collection
        ? [p.collection]
        : ["General"];
      collections.forEach((c) => {
        const cat = c.trim();
        if (cat) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });

      // Product stock calculation across variants
      let prodStock = 0;
      let prodHasSale = false;

      (p.variants || []).forEach((v) => {
        totalVariants += 1;
        const vStock = Number(v.stock) || 0;
        const vPrice = Number(v.price) || 0;
        const vSalePrice = Number(v.salePrice) || 0;
        prodStock += vStock;
        inventoryValue += vStock * (v.isSale && vSalePrice > 0 ? vSalePrice : vPrice);

        if (v.isSale && vSalePrice > 0 && vPrice > vSalePrice) {
          prodHasSale = true;
          const discountPct = Math.round(((vPrice - vSalePrice) / vPrice) * 100);
          totalDiscountPercent += discountPct;
          discountItemsCount += 1;
        }
      });

      totalStock += prodStock;

      if (prodHasSale) {
        saleProductsCount += 1;
      }

      if (prodStock === 0) {
        outOfStockProducts.push({ ...p, totalStock: 0 });
      } else if (prodStock <= 5) {
        lowStockProducts.push({ ...p, totalStock: prodStock });
      }
    });

    const avgDiscount =
      discountItemsCount > 0
        ? Math.round(totalDiscountPercent / discountItemsCount)
        : 0;

    return {
      totalProducts: products.length,
      totalVariants,
      totalStock,
      inventoryValue,
      lowStockProducts,
      outOfStockProducts,
      saleProductsCount,
      avgDiscount,
      categoryCounts,
      genderCounts,
    };
  }, [products]);

  // Current formatted date
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto pb-24 space-y-8">
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[var(--color-primary)] opacity-20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Live Control Center
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {todayFormatted}
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              FASTION ADMIN
            </h1>
            <p className="mt-2 text-sm text-gray-300 max-w-xl font-normal leading-relaxed">
              Track store performance, real-time inventory valuations, variant distributions, and restock alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] text-white px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              Add New Drop
            </Link>
            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/20 text-white px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-white/20 transition-all backdrop-blur-md"
            >
              <Package size={16} />
              View Vault
            </Link>
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700 flex items-center gap-4 shadow-xs">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 font-bold text-lg shrink-0">
            !
          </span>
          <div>
            <p className="font-bold text-red-900">Database Synchronization Notice</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* 2. Key Metrics Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Products */}
        <Card className="p-5 md:p-6 hover:shadow-md transition-shadow border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[var(--color-primary)]">
              <Package size={24} />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} />
              Active Drops
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Catalog Size
            </p>
            <h3
              className="text-2xl sm:text-3xl font-black text-gray-900 mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {loading ? "..." : stats.totalProducts}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              {stats.totalVariants} distinct color & size variants
            </p>
          </div>
        </Card>

        {/* Metric 2: Stock Units */}
        <Card className="p-5 md:p-6 hover:shadow-md transition-shadow border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Boxes size={24} />
            </div>
            {stats.outOfStockProducts.length > 0 || stats.lowStockProducts.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                <AlertTriangle size={12} />
                {stats.outOfStockProducts.length + stats.lowStockProducts.length} Attention
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Healthy Stock
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Vault Stock Units
            </p>
            <h3
              className="text-2xl sm:text-3xl font-black text-gray-900 mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {loading ? "..." : stats.totalStock.toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              Total units currently in warehouse
            </p>
          </div>
        </Card>

        {/* Metric 3: Estimated Inventory Value */}
        <Card className="p-5 md:p-6 hover:shadow-md transition-shadow border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <span className="text-xl font-bold">₹</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
              Retail Valuation
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Inventory Value
            </p>
            <h3
              className="text-2xl sm:text-3xl font-black text-gray-900 mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ₹{loading ? "..." : stats.inventoryValue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              Cumulative market price of active stock
            </p>
          </div>
        </Card>

        {/* Metric 4: On Sale / Promotions */}
        <Card className="p-5 md:p-6 hover:shadow-md transition-shadow border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Tag size={24} />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
              {stats.avgDiscount > 0 ? `Avg. -${stats.avgDiscount}%` : "Promo"}
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Discounted Drops
            </p>
            <h3
              className="text-2xl sm:text-3xl font-black text-gray-900 mt-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {loading ? "..." : stats.saleProductsCount}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              Drops with active promotional markdowns
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Low Stock Alert Center (If any item has low stock) */}
      {(stats.outOfStockProducts.length > 0 || stats.lowStockProducts.length > 0) && (
        <Card className="border-amber-200 bg-amber-50/40 p-6 md:p-8 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3
                  className="text-lg font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Restock Attention Needed ({stats.outOfStockProducts.length + stats.lowStockProducts.length} Items)
                </h3>
                <p className="text-xs text-gray-600">
                  These items are running out of units. Update variants to keep drops live.
                </p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-amber-900 uppercase tracking-wider hover:underline"
            >
              Manage in Products List &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...stats.outOfStockProducts, ...stats.lowStockProducts].slice(0, 6).map((item) => {
              const firstVariant = item.variants?.[0];
              const img = firstVariant?.images?.[0];
              const isOut = item.totalStock === 0;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                      {img ? (
                        <img src={img} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package size={18} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isOut
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isOut ? "Out of Stock" : `${item.totalStock} left`}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.variants?.length || 0} variant(s)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/admin/products/edit/${item._id}`}
                    className="shrink-0 p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-colors"
                    title="Restock Variant"
                  >
                    <Edit size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 4. Category & Collection Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Breakdown */}
        <Card className="p-6 md:p-8 bg-white border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-50 text-[var(--color-primary)]">
                <Layers size={20} />
              </span>
              <div>
                <h3
                  className="text-base font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Collection & Category Breakdown
                </h3>
                <p className="text-xs text-gray-500">Distribution across catalog categories</p>
              </div>
            </div>
            <Link
              to="/admin/collections"
              className="text-xs font-bold text-[var(--color-primary)] hover:underline uppercase tracking-wider"
            >
              Edit Banners &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.categoryCounts).length === 0 ? (
              <p className="text-sm text-gray-400 italic">No collections defined yet.</p>
            ) : (
              Object.entries(stats.categoryCounts).map(([catName, count]) => {
                const total = stats.totalProducts || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={catName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-800">{catName}</span>
                      <span className="text-gray-500">
                        {count} drop{count > 1 ? "s" : ""} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Quick Operations Hub */}
        <Card className="p-6 md:p-8 bg-white border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-100">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </span>
              <div>
                <h3
                  className="text-base font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Quick Actions
                </h3>
                <p className="text-xs text-gray-500">Fast store operations</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/admin/products/new"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-900 font-bold text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Plus size={16} />
                  </div>
                  <span>Create New Product Drop</span>
                </div>
                <ArrowRight size={15} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/admin/collections"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-900 font-bold text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Layers size={16} />
                  </div>
                  <span>Manage Collection Banners</span>
                </div>
                <ArrowRight size={15} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-900 font-bold text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ExternalLink size={16} />
                  </div>
                  <span>Open Storefront Preview</span>
                </div>
                <ArrowRight size={15} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-medium">
              System running React 18 & Vite Frontend
            </p>
          </div>
        </Card>
      </div>

      {/* 5. Recent Products Section */}
      <Card className="p-6 md:p-8 bg-white border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3
              className="text-lg font-black text-gray-900 uppercase tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Latest Catalog Drops
            </h3>
            <p className="text-xs text-gray-500">Recently updated or added streetwear items</p>
          </div>
          <Button to="/admin/products" variant="secondary" size="sm">
            View All ({products?.length || 0})
          </Button>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="py-12 text-center text-sm font-medium text-gray-400 animate-pulse">
              Loading Catalog...
            </div>
          ) : products?.length > 0 ? (
            products.slice(0, 5).map((product) => {
              const firstVariant = product.variants?.[0];
              const displayImage = firstVariant?.images?.[0];
              const totalStock = (product.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
              const hasSale = product.variants?.some((v) => v.isSale && v.salePrice > 0);
              const price = firstVariant?.price;
              const salePrice = firstVariant?.isSale ? firstVariant?.salePrice : null;

              return (
                <div
                  key={product._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-gray-50/70 rounded-2xl px-3 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="h-16 w-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 group-hover:shadow-md transition-all flex items-center justify-center">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {product.name}
                        </p>
                        {hasSale && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="font-bold text-gray-900">
                          ₹{salePrice || price || "0"}
                        </span>
                        {salePrice && (
                          <span className="text-gray-400 line-through text-[11px]">
                            ₹{price}
                          </span>
                        )}
                        <span className="text-gray-300">·</span>
                        <Badge
                          variant="secondary"
                          className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold"
                        >
                          {product.gender || "Men"}
                        </Badge>
                        <span className="text-gray-300">·</span>
                        <span
                          className={`text-[11px] font-bold ${
                            totalStock > 5
                              ? "text-emerald-600"
                              : totalStock > 0
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      to={`/admin/products/edit/${product._id}`}
                      variant="outline"
                      size="sm"
                      className="px-4 py-2 text-xs font-bold"
                    >
                      Edit Drop
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <span className="text-4xl inline-block mb-3 text-gray-300">📦</span>
              <p className="text-sm font-medium text-gray-500">
                No products found in inventory.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
