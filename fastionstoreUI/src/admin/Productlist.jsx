import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { deleteProduct } from "../services/productService";
import { useToast } from "../context/ToastContext";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  PackageOpen,
  Package,
  Layers,
  Eye,
  X,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Card, Badge, Button, Input } from "../components/ui";

const ProductList = () => {
  const { products, loading, error, removeProduct } = useProducts();
  const { addToast } = useToast();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, in_stock, low_stock, out_of_stock, on_sale
  const [genderFilter, setGenderFilter] = useState("all"); // all, Men, Women, Unisex
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest, price_asc, price_desc, stock_asc, stock_desc, name_asc

  // Modal states
  const [inspectingProduct, setInspectingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique collections dynamically for dropdown
  const uniqueCollections = useMemo(() => {
    const cols = new Set();
    (products || []).forEach((p) => {
      if (Array.isArray(p.collection)) {
        p.collection.forEach((c) => c && cols.add(c.trim()));
      } else if (typeof p.collection === "string" && p.collection.trim()) {
        cols.add(p.collection.trim());
      }
    });
    return Array.from(cols);
  }, [products]);

  // Tab counts calculation
  const counts = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let onSale = 0;

    (products || []).forEach((p) => {
      const totalStock = (p.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      const hasSale = (p.variants || []).some((v) => v.isSale && Number(v.salePrice) > 0);

      if (totalStock === 0) outOfStock++;
      else if (totalStock <= 5) lowStock++;
      else inStock++;

      if (hasSale) onSale++;
    });

    return {
      all: products?.length || 0,
      inStock,
      lowStock,
      outOfStock,
      onSale,
    };
  }, [products]);

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    let list = [...(products || [])];

    // 1. Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const collectionMatch = Array.isArray(p.collection)
          ? p.collection.some((c) => c.toLowerCase().includes(q))
          : p.collection?.toLowerCase().includes(q);
        const variantColorMatch = (p.variants || []).some((v) =>
          v.color?.toLowerCase().includes(q),
        );
        return nameMatch || descMatch || collectionMatch || variantColorMatch;
      });
    }

    // 2. Status Tab Filter
    if (statusFilter === "in_stock") {
      list = list.filter((p) => {
        const total = (p.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
        return total > 5;
      });
    } else if (statusFilter === "low_stock") {
      list = list.filter((p) => {
        const total = (p.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
        return total > 0 && total <= 5;
      });
    } else if (statusFilter === "out_of_stock") {
      list = list.filter((p) => {
        const total = (p.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
        return total === 0;
      });
    } else if (statusFilter === "on_sale") {
      list = list.filter((p) =>
        (p.variants || []).some((v) => v.isSale && Number(v.salePrice) > 0),
      );
    }

    // 3. Gender Filter
    if (genderFilter !== "all") {
      list = list.filter((p) => (p.gender || "Men") === genderFilter);
    }

    // 4. Collection Filter
    if (collectionFilter !== "all") {
      list = list.filter((p) => {
        if (Array.isArray(p.collection)) {
          return p.collection.includes(collectionFilter);
        }
        return p.collection === collectionFilter;
      });
    }

    // 5. Sorting
    list.sort((a, b) => {
      const aFirstPrice = a.variants?.[0]?.price || 0;
      const bFirstPrice = b.variants?.[0]?.price || 0;
      const aStock = (a.variants || []).reduce((s, v) => s + (Number(v.stock) || 0), 0);
      const bStock = (b.variants || []).reduce((s, v) => s + (Number(v.stock) || 0), 0);

      switch (sortBy) {
        case "price_asc":
          return aFirstPrice - bFirstPrice;
        case "price_desc":
          return bFirstPrice - aFirstPrice;
        case "stock_asc":
          return aStock - bStock;
        case "stock_desc":
          return bStock - aStock;
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "newest":
        default:
          return (b._id || "").localeCompare(a._id || "");
      }
    });

    return list;
  }, [products, searchTerm, statusFilter, genderFilter, collectionFilter, sortBy]);

  // Statistics for current filtered view
  const filteredMetrics = useMemo(() => {
    let units = 0;
    let valuation = 0;
    filteredProducts.forEach((p) => {
      (p.variants || []).forEach((v) => {
        const s = Number(v.stock) || 0;
        const pr = Number(v.price) || 0;
        const spr = Number(v.salePrice) || 0;
        units += s;
        valuation += s * (v.isSale && spr > 0 ? spr : pr);
      });
    });
    return { units, valuation };
  }, [filteredProducts]);

  // Handle Delete execution
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete._id);
      removeProduct(productToDelete._id);
      addToast(`"${productToDelete.name}" deleted successfully`, "success");
      setProductToDelete(null);
    } catch (deleteError) {
      console.error("Error deleting product:", deleteError);
      addToast("Failed to delete product. Please check API.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto pb-24 space-y-6">
      {/* 1. Header Section */}
      <Card className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between p-6 sm:p-8 bg-white border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-[var(--color-primary)]">
              <Package size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Inventory & Catalog
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Product Management
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Control drops, monitor variant stock levels, update prices, and inspect SKU details.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] text-white px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Add New Drop
          </Link>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-600 flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 font-bold text-lg shrink-0">
            !
          </span>
          <div>
            <p className="font-bold text-red-900">Database Synchronization Error</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* 2. Advanced Search & Multi-Filter Bar */}
      <Card className="p-5 bg-white border-gray-200 space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: "all", label: "All Drops", count: counts.all },
            { id: "in_stock", label: "In Stock (>5)", count: counts.inStock },
            { id: "low_stock", label: "Low Stock (≤5)", count: counts.lowStock, badgeClass: "bg-amber-100 text-amber-800" },
            { id: "out_of_stock", label: "Out of Stock", count: counts.outOfStock, badgeClass: "bg-red-100 text-red-800" },
            { id: "on_sale", label: "On Sale", count: counts.onSale, badgeClass: "bg-rose-100 text-rose-800" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm font-black"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : tab.badgeClass || "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inputs Row: Search + Gender + Collection + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
          {/* Live Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, color, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="Men">Men Only</option>
              <option value="Women">Women Only</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Collection Filter */}
          <div className="flex items-center gap-2">
            <select
              value={collectionFilter}
              onChange={(e) => setCollectionFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white cursor-pointer"
            >
              <option value="all">All Collections</option>
              {uniqueCollections.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="stock_desc">Stock: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-gray-500 font-medium border-t border-gray-100">
          <div>
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> of{" "}
            {products?.length || 0} products
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total Units: <strong className="text-gray-900">{filteredMetrics.units}</strong>
            </span>
            <span>·</span>
            <span>
              View Valuation:{" "}
              <strong className="text-gray-900">
                ₹{filteredMetrics.valuation.toLocaleString("en-IN")}
              </strong>
            </span>
          </div>
        </div>
      </Card>

      {/* 3. Products List View (Desktop Table & Mobile Cards) */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-black uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">Product & Drops</th>
                <th className="px-6 py-4">Colors & Variants</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4">Vault Stock</th>
                <th className="px-6 py-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-[var(--color-primary)] border-gray-200"></div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Synchronizing Vault Drops...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                        <PackageOpen size={32} />
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900 uppercase">
                          No matching drops found
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Try adjusting search terms or status filters.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                filteredProducts.map((product) => {
                  const firstVariant = product.variants?.[0];
                  const displayImage = firstVariant?.images?.[0] || null;
                  const displayPrice = firstVariant?.price ?? 0;
                  const salePrice = firstVariant?.isSale ? firstVariant?.salePrice : null;
                  const totalStock = (product.variants || []).reduce(
                    (sum, v) => sum + (Number(v.stock) || 0),
                    0,
                  );

                  // Extract all distinct variant colors
                  const colors = Array.from(
                    new Set(
                      (product.variants || [])
                        .map((v) => v.color)
                        .filter(Boolean),
                    ),
                  );

                  return (
                    <tr
                      key={product._id}
                      className="transition-colors hover:bg-gray-50/70 group"
                    >
                      {/* Product Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-xs flex items-center justify-center group-hover:shadow-md transition-all">
                            {displayImage ? (
                              <img
                                src={displayImage}
                                alt={product.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400 text-center px-1">
                                No Photo
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 text-sm truncate group-hover:text-[var(--color-primary)] transition-colors">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <Badge
                                variant="secondary"
                                className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold"
                              >
                                {product.gender || "Men"}
                              </Badge>
                              {Array.isArray(product.collection) &&
                                product.collection.map((c) => (
                                  <span
                                    key={c}
                                    className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[9px] font-semibold"
                                  >
                                    {c}
                                  </span>
                                ))}
                            </div>
                            <p className="mt-1 text-[11px] text-gray-400 font-mono truncate">
                              ID: {product._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Variant & Color Swatches */}
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {colors.slice(0, 4).map((c, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-700"
                              >
                                {c}
                              </span>
                            ))}
                            {colors.length > 4 && (
                              <span className="text-[10px] text-gray-400 font-bold">
                                +{colors.length - 4} more
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {product.variants?.length || 0} variant option(s)
                          </p>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-black text-gray-900">
                            ₹{salePrice || displayPrice}
                          </div>
                          {salePrice && (
                            <div className="text-[11px] text-gray-400 line-through">
                              ₹{displayPrice}
                            </div>
                          )}
                          {salePrice && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 text-[9px] font-black uppercase">
                              Save ₹{displayPrice - salePrice}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock Status */}
                      <td className="px-6 py-4">
                        <div>
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              totalStock > 10
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : totalStock > 0
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                totalStock > 10
                                  ? "bg-emerald-500"
                                  : totalStock > 0
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                            />
                            {totalStock > 0 ? `${totalStock} Units` : "Sold Out"}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {totalStock > 5
                              ? "Ready for dispatch"
                              : totalStock > 0
                              ? "Restock suggested"
                              : "Requires restock"}
                          </p>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setInspectingProduct(product)}
                            className="flex h-9 items-center gap-1.5 px-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors"
                            title="Inspect Variants"
                          >
                            <Eye size={14} />
                            <span>Variants</span>
                          </button>

                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-xs"
                            title="Edit Drop Details"
                          >
                            <Edit2 size={14} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card Grid (Visible on screens < lg) */}
        <div className="block lg:hidden divide-y divide-gray-100">
          {loading && (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-[var(--color-primary)] border-gray-200" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Loading Drops...
              </span>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <PackageOpen size={36} className="mx-auto mb-2 opacity-50" />
              <p className="font-bold text-gray-900">No products match your criteria</p>
            </div>
          )}

          {!loading &&
            filteredProducts.map((product) => {
              const firstVariant = product.variants?.[0];
              const displayImage = firstVariant?.images?.[0] || null;
              const displayPrice = firstVariant?.price ?? 0;
              const salePrice = firstVariant?.isSale ? firstVariant?.salePrice : null;
              const totalStock = (product.variants || []).reduce(
                (sum, v) => sum + (Number(v.stock) || 0),
                0,
              );

              return (
                <div key={product._id} className="p-4 sm:p-5 space-y-4 hover:bg-gray-50/50">
                  <div className="flex gap-4 items-start">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 flex items-center justify-center">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">No Photo</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold"
                        >
                          {product.gender || "Men"}
                        </Badge>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            totalStock > 10
                              ? "bg-emerald-100 text-emerald-800"
                              : totalStock > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {totalStock > 0 ? `${totalStock} Units` : "Sold Out"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium">
                        {product.variants?.length || 0} variant(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-base font-black text-gray-900">
                        ₹{salePrice || displayPrice}
                      </span>
                      {salePrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">
                          ₹{displayPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectingProduct(product)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Variants
                      </button>

                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 4. Variant Inspection Modal */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3
                  className="text-lg font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Variant Breakdown
                </h3>
                <p className="text-xs text-gray-500 truncate max-w-sm">
                  {inspectingProduct.name}
                </p>
              </div>
              <button
                onClick={() => setInspectingProduct(null)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {(inspectingProduct.variants || []).map((v, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {v.images?.[0] ? (
                        <img
                          src={v.images[0]}
                          alt={v.color}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                          No Photo
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {v.color || `Variant #${idx + 1}`}
                        </span>
                        {v.isSale && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-black uppercase">
                            Sale
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span>
                          Price: <strong>₹{v.isSale && v.salePrice ? v.salePrice : v.price}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Stock:{" "}
                          <strong
                            className={
                              (v.stock || 0) <= 5 ? "text-amber-600" : "text-emerald-600"
                            }
                          >
                            {v.stock || 0} units
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[11px] text-gray-400 font-mono">
                      {v.images?.length || 0} photos attached
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Total Variants: {inspectingProduct.variants?.length || 0}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                <Link
                  to={`/admin/products/edit/${inspectingProduct._id}`}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
                >
                  Edit in Full Editor
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Custom Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 text-red-600">
              <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3
                  className="text-lg font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Delete Drop?
                </h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
              <p className="text-sm font-bold text-gray-900 line-clamp-2">
                {productToDelete.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {productToDelete.variants?.length || 0} variants will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Drop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
