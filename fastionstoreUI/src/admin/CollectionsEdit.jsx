import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  RotateCcw, 
  X, 
  Check, 
  Sparkles,
  Layers
} from "lucide-react";
import { 
  fetchAllCollections, 
  createCollection, 
  updateCollection, 
  deleteCollection, 
  resetDefaultCollections 
} from "../services/collectionService";
import { useToast } from "../context/ToastContext";

const COLOR_PRESETS = [
  { name: "Light Blue", value: "bg-[#e0f2fe]", hex: "#e0f2fe" },
  { name: "Light Orange", value: "bg-[#ffedd5]", hex: "#ffedd5" },
  { name: "Light Gray", value: "bg-[#f1f5f9]", hex: "#f1f5f9" },
  { name: "Light Purple", value: "bg-[#f3e8ff]", hex: "#f3e8ff" },
  { name: "Light Rose", value: "bg-[#ffe4e6]", hex: "#ffe4e6" },
  { name: "Light Emerald", value: "bg-[#d1fae5]", hex: "#d1fae5" },
  { name: "Light Amber", value: "bg-[#fef3c7]", hex: "#fef3c7" },
];

const CollectionsEdit = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

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
      formData.append("slug", slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
      formData.append("subtitle", subtitle);
      formData.append("link", link || `/collections/${slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      formData.append("bgColor", bgColor);
      formData.append("order", order);

      if (imageMode === "file" && imageFile) {
        formData.append("image", imageFile);
      } else if (imageMode === "url" && imageUrl) {
        formData.append("image", imageUrl);
      }

      if (editingId) {
        await updateCollection(editingId, formData);
        addToast("Collection updated successfully!", "success");
      } else {
        await createCollection(formData);
        addToast("Collection created successfully!", "success");
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

  const handleDelete = async (id, colName) => {
    if (!window.confirm(`Are you sure you want to delete "${colName}"?`)) return;
    try {
      await deleteCollection(id);
      addToast("Collection deleted", "success");
      loadCollections();
    } catch (err) {
      console.error(err);
      addToast("Failed to delete collection", "error");
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Reset all collections to store default categories? This will replace custom edits.")) return;
    try {
      setLoading(true);
      await resetDefaultCollections();
      addToast("Collections reset to default settings!", "success");
      loadCollections();
    } catch (err) {
      console.error(err);
      addToast("Failed to reset collections", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <Layers size={22} />
            </span>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Collection Images & Details
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage the collection images, banners, titles, and accent colors displayed on the home page and storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <RotateCcw size={16} />
            Reset Defaults
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white hover:bg-black transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Plus size={18} />
            Add Collection
          </button>
        </div>
      </div>

      {/* Grid of collections */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <p className="text-gray-500 font-semibold mb-4">No collections found.</p>
          <button
            onClick={handleResetDefaults}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold uppercase"
          >
            Load Default Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div 
              key={col._id} 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
            >
              {/* Image Preview Container */}
              <div className={`relative h-48 w-full overflow-hidden flex items-center justify-center p-4 ${col.bgColor || 'bg-gray-100'}`}>
                <img
                  src={col.image}
                  alt={col.name}
                  className="h-full w-full object-cover rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80";
                  }}
                />
                <span className="absolute top-3 right-3 px-3 py-1 bg-black/60 text-white backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Order #{col.order}
                </span>
              </div>

              {/* Details & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                      {col.name}
                    </h3>
                    <span className="text-xs text-gray-400 font-mono">/{col.slug}</span>
                  </div>
                  {col.subtitle && (
                    <p className="text-xs text-gray-500 font-medium mt-1">{col.subtitle}</p>
                  )}
                  <p className="text-[11px] text-[var(--color-primary)] font-semibold mt-2 truncate flex items-center gap-1">
                    <LinkIcon size={12} /> {col.link}
                  </p>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(col)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-100 hover:bg-[var(--color-primary)] hover:text-white transition-colors text-xs font-bold text-gray-700"
                  >
                    <Edit3 size={15} /> Change Image / Edit
                  </button>
                  <button
                    onClick={() => handleDelete(col._id, col.name)}
                    className="ml-2 p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  {editingId ? "Edit Collection Image & Details" : "Add New Collection"}
                </h3>
                <p className="text-xs text-gray-500">Update storefront banners and details</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Collection Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oversized Tees"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Relaxed Fit"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Target Link & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    URL Link Path
                  </label>
                  <input
                    type="text"
                    placeholder="/collections/oversized-tees"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Image Input Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Collection Image *
                  </label>
                  <div className="flex bg-gray-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageMode("file")}
                      className={`px-3 py-1 rounded-lg transition-all ${imageMode === "file" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-3 py-1 rounded-lg transition-all ${imageMode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageMode === "file" ? (
                  <div className="relative border-2 border-dashed border-gray-300 hover:border-[var(--color-primary)] rounded-2xl p-6 text-center transition-colors cursor-pointer bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-700 uppercase">
                      {imageFile ? imageFile.name : "Click or drop image file here"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
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
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                )}

                {/* Preview Thumbnail */}
                {imagePreview && (
                  <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80";
                      }}
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white rounded text-[10px] font-bold">
                      Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Background Color Accent Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Accent Color Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBgColor(preset.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        bgColor === preset.value
                          ? "border-black bg-gray-900 text-white ring-2 ring-black/20"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: preset.hex }} />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white hover:bg-black transition-colors text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Collection" : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsEdit;
