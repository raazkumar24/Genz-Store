import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { updateProduct, createProduct } from "../services/productService";
import { useToast } from "../context/ToastContext";
import { BackButton, Badge, Button, Card } from "../components/ui";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Tag,
  IndianRupee,
  Loader2,
  UploadCloud,
  X,
  PlusCircle,
  Trash2,
  Layers,
  Plus,
  Copy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Package,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

const PREDEFINED_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "Free Size",
];

const POPULAR_COLLECTION_TAGS = [
  "Oversized Tees",
  "Hoodies",
  "Cargos",
  "Streetwear",
  "Trending",
  "Winter Drop",
  "Summer Essentials",
  "Graphic Tees",
  "Acid Wash",
  "Solid Basics",
];

const POPULAR_COLOR_PRESETS = [
  { name: "Jet Black", hex: "#0a0a0a" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Charcoal Grey", hex: "#374151" },
  { name: "Olive Green", hex: "#4b5320" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Crimson Red", hex: "#dc2626" },
  { name: "Beige / Cream", hex: "#f5f5dc" },
  { name: "Sage Green", hex: "#9ca986" },
  { name: "Mocha Brown", hex: "#6f4e37" },
  { name: "Pastel Lilac", hex: "#c8b6ff" },
];

const SPEC_PRESETS = [
  { key: "Fabric", placeholder: "100% Combed Cotton / French Terry" },
  { key: "GSM", placeholder: "240 GSM Heavyweight" },
  { key: "Fit", placeholder: "Relaxed Oversized Boxy Fit" },
  { key: "Neck", placeholder: "Ribbed Crew Neck" },
  { key: "Sleeve", placeholder: "Half Sleeve / Drop Shoulder" },
  { key: "Care", placeholder: "Machine wash cold inside out" },
  { key: "Origin", placeholder: "Crafted in India" },
];

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById, replaceProduct, addProduct } = useProducts();
  const { addToast } = useToast();

  const isNewProduct = !productId;
  const product = isNewProduct ? null : getProductById(productId);

  // Core Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gender: "Men",
    category: "",
    collection: "",
    brand: "Fastion Originals",
    topHighlights: "",
    itemDetails: "",
  });

  const [variants, setVariants] = useState([
    {
      size: "S, M, L, XL",
      color: "Jet Black",
      stock: 50,
      price: 999,
      salePrice: 799,
      isSale: true,
      isTrending: false,
      isNewArrival: true,
      keywords: "",
      images: [],
      imageFiles: [],
    },
  ]);

  const [specifications, setSpecifications] = useState([
    { key: "Fabric", value: "100% Heavyweight Cotton" },
    { key: "GSM", value: "240 GSM" },
    { key: "Fit", value: "Oversized Fit" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeImageModalVariantIndex, setActiveImageModalVariantIndex] = useState(null);

  // Populate data when editing existing product
  useEffect(() => {
    if (isNewProduct) return;

    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        gender: product.gender || "Men",
        category: Array.isArray(product.category)
          ? product.category.join(", ")
          : product.category || "",
        collection: Array.isArray(product.collection)
          ? product.collection.join(", ")
          : product.collection || "",
        brand: product.brand || "Fastion Originals",
        topHighlights: product.productDetails?.topHighlights?.join("\n") || "",
        itemDetails: product.productDetails?.itemDetails || "",
      });

      if (product.variants && product.variants.length > 0) {
        setVariants(
          product.variants.map((v) => ({
            ...v,
            imageFiles: [],
            stock: v.stock ?? 0,
            price: v.price ?? 0,
            salePrice: v.salePrice ?? 0,
          })),
        );
      }

      setSpecifications(
        product.productDetails?.specifications?.length > 0
          ? product.productDetails.specifications
          : [{ key: "Fabric", value: "" }, { key: "Fit", value: "" }],
      );
    }
  }, [product, isNewProduct]);

  // Form field handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((curr) => ({
      ...curr,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle collection tag in comma-separated string
  const toggleCollectionTag = (tag) => {
    const currentTags = (formData.collection || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    let nextTags;
    if (currentTags.includes(tag)) {
      nextTags = currentTags.filter((t) => t !== tag);
    } else {
      nextTags = [...currentTags, tag];
    }
    setFormData((curr) => ({ ...curr, collection: nextTags.join(", ") }));
  };

  // Variant change handler
  const handleVariantChange = (index, field, value, type = "text") => {
    setVariants((prev) => {
      const updated = [...prev];
      if (type === "checkbox") {
        updated[index][field] = value;
      } else if (field === "stock" || field === "price" || field === "salePrice") {
        updated[index][field] = value === "" ? "" : Number(value);
      } else {
        updated[index][field] = value;
      }
      return updated;
    });
  };

  // Add new blank variant
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "S, M, L, XL",
        color: "",
        stock: 20,
        price: prev[prev.length - 1]?.price || 999,
        salePrice: prev[prev.length - 1]?.salePrice || "",
        isSale: prev[prev.length - 1]?.isSale || false,
        isTrending: false,
        isNewArrival: false,
        keywords: "",
        images: [],
        imageFiles: [],
      },
    ]);
  };

  // Duplicate an existing variant
  const duplicateVariant = (index) => {
    const target = variants[index];
    setVariants((prev) => [
      ...prev,
      {
        ...target,
        color: target.color ? `${target.color} (Copy)` : "New Color",
        images: [...(target.images || [])],
        imageFiles: [],
      },
    ]);
    addToast(`Duplicated Variant #${index + 1}`, "info");
  };

  // Remove variant
  const removeVariant = (indexToRemove) => {
    if (variants.length <= 1) {
      addToast("At least one product variant is required.", "error");
      return;
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Quick preset sizes
  const setQuickSizes = (variantIndex, sizeOption) => {
    let sizes = "";
    if (sizeOption === "all") {
      sizes = PREDEFINED_SIZES.join(", ");
    } else if (sizeOption === "standard") {
      sizes = "S, M, L, XL";
    } else if (sizeOption === "plus") {
      sizes = "XL, XXL, 3XL";
    }
    handleVariantChange(variantIndex, "size", sizes);
  };

  // Specifications
  const handleSpecChange = (index, field, value) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addSpec = (key = "", value = "") => {
    setSpecifications((prev) => [...prev, { key, value }]);
  };

  const removeSpec = (indexToRemove) => {
    setSpecifications((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Live Inventory & Valuation summary
  const summary = useMemo(() => {
    let totalStock = 0;
    let minPrice = Infinity;
    let maxPrice = 0;

    variants.forEach((v) => {
      totalStock += Number(v.stock) || 0;
      const effectivePrice = v.isSale && Number(v.salePrice) > 0 ? Number(v.salePrice) : Number(v.price) || 0;
      if (effectivePrice < minPrice) minPrice = effectivePrice;
      if (effectivePrice > maxPrice) maxPrice = effectivePrice;
    });

    if (minPrice === Infinity) minPrice = 0;

    return { totalStock, minPrice, maxPrice };
  }, [variants]);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!formData.name.trim()) {
      setError("Product Name is required.");
      setSaving(false);
      return;
    }

    if (variants.length === 0) {
      setError("Please add at least one variant.");
      setSaving(false);
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.size) {
        setError(`Variant #${i + 1} requires at least one size.`);
        setSaving(false);
        return;
      }
      if (!v.color || !v.color.trim()) {
        setError(`Variant #${i + 1} requires a colour/shade.`);
        setSaving(false);
        return;
      }
      if (v.price === undefined || v.price === "" || Number(v.price) <= 0) {
        setError(`Variant #${i + 1} (${v.color || "Unnamed"}) requires a valid price.`);
        setSaving(false);
        return;
      }
      if (v.stock === undefined || v.stock === "" || Number(v.stock) < 0) {
        setError(`Variant #${i + 1} (${v.color || "Unnamed"}) requires a valid stock count.`);
        setSaving(false);
        return;
      }
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description || formData.itemDetails || formData.name);
      payload.append("gender", formData.gender);
      if (formData.brand) payload.append("brand", formData.brand);

      if (formData.category) {
        const categoryArray = formData.category.split(",").map((c) => c.trim()).filter(Boolean);
        payload.append("category", JSON.stringify(categoryArray));
      }

      if (formData.collection) {
        const collectionArray = formData.collection.split(",").map((c) => c.trim()).filter(Boolean);
        payload.append("collection", JSON.stringify(collectionArray));
      }

      const topHighlightsArray = formData.topHighlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);

      const productDetails = {
        topHighlights: topHighlightsArray,
        specifications: specifications.filter(
          (s) => s.key.trim() !== "" && s.value.trim() !== "",
        ),
        itemDetails: formData.itemDetails,
      };
      payload.append("productDetails", JSON.stringify(productDetails));

      const variantsForJson = variants.map((v) => {
        const { imageFiles, image, imageFile, ...rest } = v;
        if (typeof rest.keywords === "string") {
          rest.keywords = rest.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);
        }
        rest.salePrice = rest.salePrice === "" ? 0 : Number(rest.salePrice);
        rest.stock = Number(rest.stock) || 0;
        rest.price = Number(rest.price) || 0;
        return rest;
      });
      payload.append("variants", JSON.stringify(variantsForJson));

      variants.forEach((v, index) => {
        if (v.imageFiles && v.imageFiles.length > 0) {
          v.imageFiles.forEach((file) => {
            payload.append(`variantImage_${index}`, file);
          });
        }
      });

      if (isNewProduct) {
        const response = await createProduct(payload);
        if (response.product) addProduct(response.product);
        addToast(`Drop "${formData.name}" created successfully`, "success");
        navigate("/admin/products");
      } else {
        const updatedProduct = await updateProduct(productId, payload);
        replaceProduct(updatedProduct);
        addToast(`Drop "${formData.name}" updated successfully`, "success");
        navigate("/admin/products");
      }
    } catch (submitError) {
      console.error("Product save failed:", submitError);
      let errorMessage = "Failed to save product. Please verify inputs and network connection.";
      if (submitError.response?.data) {
        const data = submitError.response.data;
        errorMessage = data.error || data.message || errorMessage;
      }
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isNewProduct && !product) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm mt-8">
        <div className="h-16 w-16 mb-4 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-xs">
          <Package size={32} />
        </div>
        <h2
          className="text-2xl font-black text-gray-900 uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Product Not Found
        </h2>
        <p className="mt-2 text-xs text-gray-500">
          The drop you are attempting to edit does not exist or may have been deleted.
        </p>
        <Link
          to="/admin/products"
          className="mt-6 rounded-2xl bg-gray-900 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-gray-800 transition-colors"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto pb-36 space-y-6">
      {/* 1. Header Banner */}
      <Card className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 sm:p-8 bg-white border-gray-200">
        <div className="flex items-start gap-4">
          <BackButton fallbackPath="/admin/products" text="Drops List" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-xl bg-blue-50 text-[var(--color-primary)]">
                <Package size={16} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {isNewProduct ? "New Drop Configuration" : `Editing ID: ${productId?.slice(-6)}`}
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {isNewProduct ? "Create Product Drop" : `Edit: ${formData.name || "Product"}`}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Configure sizing, colors, pricing matrices, specifications, and media assets.
            </p>
          </div>
        </div>

        {/* Live Metrics Pill */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/80 rounded-2xl p-3 shrink-0">
          <div className="text-right px-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total Units
            </span>
            <span className="text-sm font-black text-gray-900">
              {summary.totalStock} Units
            </span>
          </div>
          <div className="h-7 w-px bg-gray-200" />
          <div className="text-right px-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Price Range
            </span>
            <span className="text-sm font-black text-[var(--color-primary)]">
              {summary.minPrice === summary.maxPrice
                ? `₹${summary.minPrice}`
                : `₹${summary.minPrice} - ₹${summary.maxPrice}`}
            </span>
          </div>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-3 animate-in fade-in">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Col Area: Core Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Details Card */}
            <Card className="p-6 sm:p-8 bg-white border-gray-200 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-gray-100 text-gray-700">
                    <FileText size={18} />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                      Drop Essentials
                    </h3>
                    <p className="text-xs text-gray-500">
                      Product title, brand identity, and customer-facing descriptions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Acid Wash Boxy Graphic Tee"
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Brand / Label
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Fastion Originals"
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Target Demographic
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    <option value="Men">Men (Male Collection)</option>
                    <option value="Women">Women (Female Collection)</option>
                    <option value="Unisex">Unisex (Gender Neutral)</option>
                  </select>
                </div>

                {/* Detailed Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Item Description & Story
                  </label>
                  <textarea
                    name="itemDetails"
                    value={formData.itemDetails}
                    onChange={handleChange}
                    placeholder="Describe the silhouette, garment feel, stitching, and style inspiration..."
                    rows={4}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-y placeholder:text-gray-400"
                  />
                </div>

                {/* Top Highlights */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Key Highlights (One Bullet Per Line)
                  </label>
                  <textarea
                    name="topHighlights"
                    value={formData.topHighlights}
                    onChange={handleChange}
                    placeholder="100% Super Combed Heavyweight Cotton&#10;Ribbed Crew Neckline with Drop Shoulders&#10;Pre-shrunk to prevent shrinkage after wash&#10;High-density screenprint graphic"
                    rows={3}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-y placeholder:text-gray-400 font-mono text-xs"
                  />
                </div>
              </div>
            </Card>

            {/* Specifications Card */}
            <Card className="p-6 sm:p-8 bg-white border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <SlidersHorizontal size={18} />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                      Technical Specifications
                    </h3>
                    <p className="text-xs text-gray-500">
                      Fabric weight, weave, fit silhouette, and wash care.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addSpec()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                >
                  <Plus size={14} /> Add Row
                </button>
              </div>

              {/* Quick Spec Presets */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Quick-Fill Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SPEC_PRESETS.map((preset) => {
                    const alreadyExists = specifications.some(
                      (s) => s.key.toLowerCase() === preset.key.toLowerCase(),
                    );
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => {
                          if (!alreadyExists) {
                            addSpec(preset.key, preset.placeholder);
                          }
                        }}
                        disabled={alreadyExists}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          alreadyExists
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        + {preset.key}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spec Rows */}
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-200"
                  >
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                      placeholder="Property (e.g. Fabric)"
                      className="w-full sm:w-1/3 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                      placeholder="Value (e.g. 100% French Terry Cotton)"
                      className="w-full sm:flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar: Categorization & Storefront Tagging */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white border-gray-200 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Tag size={18} />
                </span>
                <div>
                  <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">
                    Storefront Tags
                  </h3>
                  <p className="text-xs text-gray-500">Map drops into collections and categories.</p>
                </div>
              </div>

              {/* Collections & Drop Categorization */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Collections Assigned
                </label>
                <input
                  type="text"
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  placeholder="e.g. Oversized Tees, Hoodies, Trending"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100"
                />

                {/* Clickable Quick Tags */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Click to Toggle Tag:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_COLLECTION_TAGS.map((tag) => {
                      const isSelected = (formData.collection || "")
                        .split(",")
                        .map((t) => t.trim())
                        .includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleCollectionTag(tag)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                            isSelected
                              ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Secondary Category / Search Terms */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Secondary Category / Search Keywords
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. T-Shirts, Tops, Streetwear"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <p className="text-[11px] text-gray-400">
                  Used by the storefront search engine to index this drop.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* 3. Comprehensive Variant Matrix Builder (Full Width) */}
        <Card className="p-6 sm:p-8 bg-white border-gray-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Layers size={20} />
              </span>
              <div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                  Colorways & Variant Matrix ({variants.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Manage individual SKU colorways, image galleries, stock levels, and sale prices.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              Add Colorway Variant
            </button>
          </div>

          {/* Variants Grid */}
          <div className="space-y-5">
            {variants.map((variant, index) => {
              const currentSizes = (variant.size || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

              const hasDiscount =
                variant.isSale &&
                Number(variant.salePrice) > 0 &&
                Number(variant.price) > Number(variant.salePrice);
              const discountPct = hasDiscount
                ? Math.round(
                    ((Number(variant.price) - Number(variant.salePrice)) /
                      Number(variant.price)) *
                      100,
                  )
                : 0;

              const totalImages =
                (variant.images?.length || 0) + (variant.imageFiles?.length || 0);
              const displayCover =
                variant.imageFiles?.[0]
                  ? URL.createObjectURL(variant.imageFiles[0])
                  : variant.images?.[0] || null;

              return (
                <div
                  key={index}
                  className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs hover:border-gray-300 transition-all space-y-5"
                >
                  {/* Variant Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-900 text-white text-xs font-black">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        {variant.color || "Untitled Colorway"}
                      </span>
                      {variant.isSale && (
                        <Badge
                          variant="danger"
                          className="px-2 py-0.5 text-[9px] font-black uppercase"
                        >
                          Sale Active ({discountPct}% OFF)
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => duplicateVariant(index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors"
                        title="Duplicate this variant's configuration"
                      >
                        <Copy size={13} />
                        <span>Duplicate</span>
                      </button>

                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete variant"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Variant Controls Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Image Preview / Trigger Button */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setActiveImageModalVariantIndex(index)}
                        className="group relative h-40 w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 overflow-hidden flex flex-col items-center justify-center transition-all cursor-pointer"
                      >
                        {displayCover ? (
                          <>
                            <img
                              src={displayCover}
                              alt="Variant Cover"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white p-2 text-center">
                              <ImageIcon size={20} className="mb-1" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">
                                Manage Photos ({totalImages})
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-4 text-gray-400 group-hover:text-gray-700">
                            <UploadCloud size={28} />
                            <span className="text-xs font-bold">Upload Photos</span>
                            <span className="text-[10px] text-gray-400">Click to attach</span>
                          </div>
                        )}

                        {totalImages > 0 && (
                          <div className="absolute top-2 right-2 rounded-lg bg-gray-900/80 backdrop-blur-sm text-white px-2 py-0.5 text-[10px] font-bold">
                            {totalImages} Photos
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Sizing, Color & Numeric Inputs */}
                    <div className="lg:col-span-9 space-y-4">
                      {/* Colorway & Presets */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                          Colorway / Shade Name <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) =>
                              handleVariantChange(index, "color", e.target.value)
                            }
                            placeholder="e.g. Jet Black, Vintage Washed Charcoal"
                            className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100"
                            required
                          />
                        </div>

                        {/* Swatch Quick Pickers */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                            Palette:
                          </span>
                          {POPULAR_COLOR_PRESETS.map((col) => (
                            <button
                              key={col.name}
                              type="button"
                              onClick={() => handleVariantChange(index, "color", col.name)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-gray-700 transition-colors border border-gray-200"
                            >
                              <span
                                className="h-2.5 w-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: col.hex }}
                              />
                              {col.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Matrix Selector */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                            Available Sizing:{" "}
                            <span className="text-gray-400 font-normal">
                              ({currentSizes.join(", ") || "None selected"})
                            </span>
                          </label>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                            <button
                              type="button"
                              onClick={() => setQuickSizes(index, "standard")}
                              className="hover:text-gray-900 underline"
                            >
                              Standard (S-XL)
                            </button>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => setQuickSizes(index, "all")}
                              className="hover:text-gray-900 underline"
                            >
                              All Sizes
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {PREDEFINED_SIZES.map((sz) => {
                            const isSelected = currentSizes.includes(sz);
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => {
                                  const nextSizes = isSelected
                                    ? currentSizes.filter((s) => s !== sz)
                                    : [...currentSizes, sz];
                                  handleVariantChange(
                                    index,
                                    "size",
                                    nextSizes.join(", "),
                                  );
                                }}
                                className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all border ${
                                  isSelected
                                    ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pricing & Stock Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                        {/* Base Price */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Regular Price (₹) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(index, "price", e.target.value)
                              }
                              min="0"
                              placeholder="999"
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                              required
                            />
                          </div>
                        </div>

                        {/* Stock Units */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Vault Stock (Units) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(index, "stock", e.target.value)
                            }
                            min="0"
                            placeholder="50"
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                              Number(variant.stock) === 0
                                ? "border-red-300 bg-red-50 text-red-800"
                                : Number(variant.stock) <= 5
                                ? "border-amber-300 bg-amber-50 text-amber-800"
                                : "border-gray-300 bg-white text-gray-900"
                            }`}
                            required
                          />
                        </div>

                        {/* Sale Price Override */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                              Sale Price (₹)
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={variant.isSale || false}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "isSale",
                                    e.target.checked,
                                    "checkbox",
                                  )
                                }
                                className="rounded text-red-600 focus:ring-red-500 h-3.5 w-3.5 cursor-pointer"
                              />
                              <span className="text-[10px] font-bold text-red-600 uppercase">
                                Activate
                              </span>
                            </label>
                          </div>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                            <input
                              type="number"
                              disabled={!variant.isSale}
                              value={variant.salePrice || ""}
                              onChange={(e) =>
                                handleVariantChange(index, "salePrice", e.target.value)
                              }
                              min="0"
                              placeholder={variant.isSale ? "799" : "Disabled"}
                              className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                                variant.isSale
                                  ? "border-rose-300 bg-rose-50/50 text-rose-900"
                                  : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Flags & Tags Row */}
                      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variant.isTrending || false}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "isTrending",
                                e.target.checked,
                                "checkbox",
                              )
                            }
                            className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <span className="font-bold text-gray-700">Trending SKU</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variant.isNewArrival || false}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "isNewArrival",
                                e.target.checked,
                                "checkbox",
                              )
                            }
                            className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <span className="font-bold text-gray-700">New Arrival</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 4. Floating Elevated Save Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-6 py-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
              <span className="flex items-center gap-1.5">
                <Package size={16} className="text-gray-400" />
                {variants.length} Colorway(s)
              </span>
              <span>·</span>
              <span>
                Total Stock: <strong className="text-gray-900">{summary.totalStock}</strong> units
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                to="/admin/products"
                className="px-5 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel & Discard
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 text-white px-8 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-gray-800 transition-all shadow-md shadow-black/10 active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Drop...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isNewProduct ? "Publish New Drop" : "Save All Changes"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 5. Comprehensive Image Upload & Gallery Modal */}
      {activeImageModalVariantIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3
                  className="text-lg font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Manage Variant Images
                </h3>
                <p className="text-xs text-gray-500">
                  {variants[activeImageModalVariantIndex]?.color ||
                    `Variant #${activeImageModalVariantIndex + 1}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveImageModalVariantIndex(null)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drag and drop upload zone */}
            <div
              className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-3xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer relative group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const curr = variants[activeImageModalVariantIndex];
                  handleVariantChange(activeImageModalVariantIndex, "imageFiles", [
                    ...(curr.imageFiles || []),
                    ...Array.from(e.dataTransfer.files),
                  ]);
                }
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const curr = variants[activeImageModalVariantIndex];
                    handleVariantChange(activeImageModalVariantIndex, "imageFiles", [
                      ...(curr.imageFiles || []),
                      ...Array.from(e.target.files),
                    ]);
                  }
                  e.target.value = "";
                }}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Click to browse or drop images here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports JPG, PNG, WEBP. First image will be used as cover.
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery list */}
            {(() => {
              const curr = variants[activeImageModalVariantIndex];
              const existing = curr.images || [];
              const pending = curr.imageFiles || [];

              if (existing.length === 0 && pending.length === 0) {
                return (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No images attached to this colorway yet.
                  </p>
                );
              }

              return (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Attached Photos ({existing.length + pending.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Existing from DB */}
                    {existing.map((url, i) => (
                      <div
                        key={`existing-${i}`}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group bg-gray-100 shadow-xs"
                      >
                        <img
                          src={url}
                          alt="Product variant"
                          className="h-full w-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-gray-900 text-white text-[9px] font-black uppercase tracking-wider">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...existing];
                            updated.splice(i, 1);
                            handleVariantChange(
                              activeImageModalVariantIndex,
                              "images",
                              updated,
                            );
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-xs"
                          title="Remove photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    {/* Pending Upload Files */}
                    {pending.map((file, i) => (
                      <div
                        key={`pending-${i}`}
                        className="relative aspect-square rounded-2xl overflow-hidden border-2 border-emerald-300 group bg-gray-100 shadow-xs"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Pending Upload"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">
                          New
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...pending];
                            updated.splice(i, 1);
                            handleVariantChange(
                              activeImageModalVariantIndex,
                              "imageFiles",
                              updated,
                            );
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-xs"
                          title="Remove photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveImageModalVariantIndex(null)}
                className="px-6 py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-black uppercase tracking-wider hover:bg-gray-800"
              >
                Save Photo Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
