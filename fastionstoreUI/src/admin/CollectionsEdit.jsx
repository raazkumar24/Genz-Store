import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  X,
  Layers,
  Search,
  ExternalLink,
  Package,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Palette,
  Check,
} from "lucide-react";
import {
  fetchAllCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  resetDefaultCollections,
} from "../services/collectionService";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import { Card, Badge, Button } from "../components/ui";

const COLOR_PRESETS = [
  { name: "Sky Blue", value: "bg-[#e0f2fe]", hex: "#e0f2fe", textColor: "text-sky-950" },
  { name: "Warm Orange", value: "bg-[#ffedd5]", hex: "#ffedd5", textColor: "text-amber-950" },
  { name: "Slate Mist", value: "bg-[#f1f5f9]", hex: "#f1f5f9", textColor: "text-slate-900" },
  { name: "Lilac Lavender", value: "bg-[#f3e8ff]", hex: "#f3e8ff", textColor: "text-purple-950" },
  { name: "Rose Petal", value: "bg-[#ffe4e6]", hex: "#ffe4e6", textColor: "text-rose-950" },
  { name: "Mint Emerald", value: "bg-[#d1fae5]", hex: "#d1fae5", textColor: "text-emerald-950" },
  { name: "Soft Amber", value: "bg-[#fef3c7]", hex: "#fef3c7", textColor: "text-amber-950" },
  { name: "Jet Dark", value: "bg-gray-900", hex: "#111827", textColor: "text-white" },
];

const CollectionsEdit = () => {
  const { products } = useProducts();
  const { addToast } = useToast();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [bgColor, setBgColor] = useState("bg-[#e0f2fe]");
  const [order, setOrder] = useState(0);
  const [imageMode, setImageMode] = useState("file"); // "file" | "url"
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCollections();
      setCollections(data);
    } catch (err) {
      console.error(err);
      addToast("Failed to load collections", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  // Map product counts to each collection
  const collectionProductCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const cols = Array.isArray(p.collection)
        ? p.collection
        : typeof p.collection === "string"
        ? p.collection.split(",")
        : [];

      cols.forEach((c) => {
        const key = c.trim().toLowerCase();
        if (key) {
          counts[key] = (counts[key] || 0) + 1;
        }
      });
    });
    return counts;
  }, [products]);

  // Filtered collections
  const filteredCollections = useMemo(() => {
    let list = [...collections];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return list;
  }, [collections, searchTerm]);

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSubtitle("");
    setLink("");
    setBgColor("bg-[#e0f2fe]");
    setOrder(collections.length + 1);
    setImageMode("file");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (col) => {
    setEditingId(col._id);
    setName(col.name || "");
    setSlug(col.slug || "");
    setSubtitle(col.subtitle || "");
    setLink(col.link || "");
    setBgColor(col.bgColor || "bg-[#e0f2fe]");
    setOrder(col.order || 0);
    setImageMode(col.image?.startsWith("http") || col.image?.startsWith("/") ? "url" : "file");
    setImageUrl(col.image || "");
    setImageFile(null);
    setImagePreview(col.image || "");
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!editingId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(autoSlug);
      setLink(`/collections/${autoSlug}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Please enter a collection name", "error");
      return;
    }

    if (imageMode === "url" && !imageUrl.trim() && !editingId) {
      addToast("Please enter an image URL", "error");
      return;
    }

    if (imageMode === "file" && !imageFile && !editingId) {
      addToast("Please select an image file to upload", "error");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append(
        "slug",
        slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      );
      formData.append("subtitle", subtitle);
      formData.append(
        "link",
        link || `/collections/${slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      );
      formData.append("bgColor", bgColor);
      formData.append("order", order);

      if (imageMode === "file" && imageFile) {
        formData.append("image", imageFile);
      } else if (imageMode === "url" && imageUrl) {
        formData.append("image", imageUrl);
      }

      if (editingId) {
        await updateCollection(editingId, formData);
        addToast(`Collection "${name}" updated successfully!`, "success");
      } else {
        await createCollection(formData);
        addToast(`Collection "${name}" created successfully!`, "success");
      }

      setIsModalOpen(false);
      loadCollections();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to save collection", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!collectionToDelete) return;
    try {
      await deleteCollection(collectionToDelete._id);
      addToast(`Collection "${collectionToDelete.name}" deleted`, "success");
      setCollectionToDelete(null);
      loadCollections();
    } catch (err) {
      console.error(err);
      addToast("Failed to delete collection", "error");
    }
  };

  const handleResetDefaults = async () => {
    try {
      setLoading(true);
      await resetDefaultCollections();
      addToast("Collections reset to default store configuration!", "success");
      setIsResetConfirmOpen(false);
      loadCollections();
    } catch (err) {
      console.error(err);
      addToast("Failed to reset collections", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto pb-24 space-y-6">
      {/* 1. Header Banner */}
      <Card className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 sm:p-8 bg-white border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
              <Layers size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Storefront Curations
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Collections & Landing Banners
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Control the visual drop cards, campaign titles, and banner imagery featured on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all active:scale-95"
          >
            <RotateCcw size={15} />
            Reset Defaults
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Add Collection
          </button>
        </div>
      </Card>

      {/* 2. Filter / Search Bar */}
      <Card className="p-4 bg-white border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search collections by title, subtitle, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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

        <div className="text-xs font-bold text-gray-500">
          Showing <strong className="text-gray-900">{filteredCollections.length}</strong> of{" "}
          {collections.length} Collections
        </div>
      </Card>

      {/* 3. Collections Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
          ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        <Card className="p-12 text-center bg-white border-gray-200 space-y-4">
          <Layers size={40} className="mx-auto text-gray-400" />
          <h3 className="text-lg font-black text-gray-900 uppercase">No Collections Found</h3>
          <p className="text-xs text-gray-500">
            {searchTerm ? "No collections match your search filter." : "Create your first collection banner."}
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800"
          >
            <Plus size={15} /> Create Collection
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((col) => {
            const productCount =
              collectionProductCounts[col.name?.toLowerCase()] ||
              collectionProductCounts[col.slug?.toLowerCase()] ||
              0;

            return (
              <div
                key={col._id}
                className="rounded-3xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col group hover:shadow-md hover:border-gray-300 transition-all duration-300"
              >
                {/* Visual Banner Preview Card */}
                <div
                  className={`relative h-56 w-full overflow-hidden flex items-center justify-center p-4 transition-colors ${
                    col.bgColor || "bg-[#e0f2fe]"
                  }`}
                >
                  <img
                    src={col.image}
                    alt={col.name}
                    className="h-full w-full object-cover rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-black/70 text-white backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider">
                      Position #{col.order}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 text-gray-900 backdrop-blur-md rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1">
                      <Package size={11} />
                      {productCount} Drop(s)
                    </span>
                  </div>
                </div>

                {/* Info & Meta */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-lg font-black text-gray-900 tracking-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {col.name}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                        /{col.slug}
                      </span>
                    </div>

                    {col.subtitle && (
                      <p className="text-xs font-semibold text-gray-500">{col.subtitle}</p>
                    )}

                    <p className="text-[11px] text-[var(--color-primary)] font-mono truncate flex items-center gap-1 pt-1">
                      <LinkIcon size={12} /> {col.link}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => openEditModal(col)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-900 hover:text-white transition-colors text-xs font-bold text-gray-800"
                    >
                      <Edit3 size={14} />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectionToDelete(col)}
                      className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3
                  className="text-lg font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {editingId ? "Edit Collection Banner" : "New Collection Banner"}
                </h3>
                <p className="text-xs text-gray-500">Configure storefront branding and media asset</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Collection Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oversized Tees"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Subtitle / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Relaxed Fit Heavyweight"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Storefront Link Path
                  </label>
                  <input
                    type="text"
                    placeholder="/collections/oversized-tees"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Image Input */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Collection Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex bg-gray-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        imageMode === "file" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        imageMode === "url" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageMode === "file" ? (
                  <div className="relative border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-2xl p-6 text-center transition-all bg-gray-50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto h-7 w-7 text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-800">
                      {imageFile ? imageFile.name : "Click or drag image file here"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP</p>
                  </div>
                ) : (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or /models/model1.png"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                )}

                {imagePreview && (
                  <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-bold">
                      Asset Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Accent Palette */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Background Theme Accent
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBgColor(preset.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        bgColor === preset.value
                          ? "border-gray-900 bg-gray-900 text-white shadow-xs"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: preset.hex }}
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {collectionToDelete && (
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
                  Delete Collection?
                </h3>
                <p className="text-xs text-gray-500">This will remove the banner from storefront.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="text-sm font-bold text-gray-900">{collectionToDelete.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">{collectionToDelete.link}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCollectionToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Reset Defaults Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 text-amber-600">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <RotateCcw size={24} />
              </div>
              <div>
                <h3
                  className="text-lg font-black text-gray-900 uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Reset Default Collections?
                </h3>
                <p className="text-xs text-gray-500">Restore factory collection categories & layouts.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200">
              This action will reset collection items back to the store defaults (Oversized Tees, Hoodies, Cargos, Menswear, Womenswear).
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsEdit;
