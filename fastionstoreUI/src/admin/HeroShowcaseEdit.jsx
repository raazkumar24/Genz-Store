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
  X,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import {
  getHeroMasterConfig,
  fetchHeroMasterConfig,
  saveHeroMasterConfig,
  uploadHeroImageFile,
  resetHeroMasterConfig,
  formatHeroImageUrl,
  DEFAULT_ARCHIVED_CATALOG,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HERO_SPOTLIGHT,
  DEFAULT_TACTICAL_DROP,
} from "../services/heroShowcaseService";

/**
 * ============================================================================
 * DualImageInput Component
 * ============================================================================
 * Provides both local file upload (directly uploaded to backend & cloud)
 * and direct URL / relative path input with live thumbnail preview & reset.
 * ============================================================================
 */
const DualImageInput = ({
  label = "Image",
  value = "",
  onChange,
  placeholder = "e.g. /models/model1.png or https://...",
  helpText = "Upload image file from computer or paste direct URL",
  presets = null,
  products = null,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast("File size should be under 10MB.", "warning");
      return;
    }

    setIsUploading(true);
    addToast("Uploading image to backend/cloud...", "info");

    try {
      const uploadedUrl = await uploadHeroImageFile(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
        addToast("Image uploaded successfully! Click 'Save & Publish' to persist.", "success");
      }
    } catch (uploadErr) {
      console.warn("Upload fallback to local compression:", uploadErr);
      if (uploadErr.response?.status === 401) {
        addToast("Admin session expired. Please log in again to upload images to cloud.", "error");
      } else {
        addToast("Backend upload issue. Compressing locally...", "warning");
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 1200;
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              const ratio = Math.min(maxDim / width, maxDim / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const isPng = file.type === "image/png";
            const compressed = canvas.toDataURL(isPng ? "image/png" : "image/webp", 0.85);
            onChange(compressed);
            addToast("Image attached! Click 'Save & Publish' to persist.", "success");
          } catch (err) {
            onChange(event.target?.result);
            addToast("Image attached! Click 'Save & Publish' to persist.", "success");
          }
        };
        img.src = event.target?.result;
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="space-y-2.5 p-3.5 rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
          <ImageIcon size={13} className="text-[#FF3B00]" />
          <span>{label}</span>
        </label>
        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
          Upload + URL
        </span>
      </div>

      {helpText && (
        <p className="text-[10px] text-gray-400 font-medium">
          {helpText}
        </p>
      )}

      {/* Dual Inputs Row: URL input + File Upload Button */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 pl-8 pr-8 rounded-xl border border-gray-300 focus:border-black text-xs font-mono bg-white"
          />
          <LinkIcon size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-rose-500 cursor-pointer"
              title="Clear Image"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="sm:col-span-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            disabled={isUploading}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 hover:bg-[#FF3B00] disabled:bg-gray-400 text-white text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <Upload size={13} className={isUploading ? "animate-bounce" : ""} />
            <span>{isUploading ? "Uploading..." : "Upload File"}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Bar */}
      <div className="flex items-center gap-3 pt-1">
        <div className="relative h-12 w-12 rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
          <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
          {value ? (
            <img
              src={formatHeroImageUrl(value)}
              alt="Preview"
              className="h-full w-full object-contain relative z-10 select-none"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/models/model1.png";
              }}
            />
          ) : (
            <ImageIcon size={16} className="text-gray-300 relative z-10" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-gray-700 truncate">
            {value
              ? value.startsWith("data:")
                ? "Local Compressed Image"
                : value.split("/").pop() || value
              : "No image attached"}
          </p>
          <p className="text-[10px] text-gray-400 font-mono truncate">
            {value
              ? value.length > 45
                ? `${value.substring(0, 42)}...`
                : value
              : "Ready for direct URL or file upload"}
          </p>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] font-mono text-rose-600 hover:underline px-2 py-1 rounded bg-rose-50 border border-rose-100 cursor-pointer shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Model Presets if provided */}
      {presets && presets.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">
            Quick Studio Model Presets:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
            {presets.map((preset) => {
              const isSelected = value === preset.path;
              return (
                <button
                  key={preset.path}
                  type="button"
                  onClick={() => onChange(preset.path)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase transition flex items-center gap-1 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                  }`}
                >
                  <img src={preset.path} alt="" className="h-4 w-4 object-contain" />
                  <span className="truncate max-w-[120px]">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Catalog Image Shortcuts if provided */}
      {products && products.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">
            Or Pick From Store Catalog:
          </p>
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
                  onClick={() => onChange(pImg)}
                  className="h-10 w-10 rounded-lg border border-gray-200 bg-white p-1 shrink-0 hover:border-black hover:scale-105 transition cursor-pointer"
                  title={p.name}
                >
                  <img src={pImg} alt="" className="h-full w-full object-contain" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Sub-states for specific tabs
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [spotlightSearchTerm, setSpotlightSearchTerm] = useState("");
  const [spotlightCategoryFilter, setSpotlightCategoryFilter] = useState("all");
  const [tacticalSearchTerm, setTacticalSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchHeroMasterConfig().then((cfg) => {
      if (isMounted && cfg) {
        setMasterConfig(cfg);
      }
    });
    return () => {
      isMounted = false;
    };
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
      addToast("Hero banner must have at least 1 slide.", "warning");
      return;
    }
    const updated = currentSlides.filter((_, i) => i !== idx);
    setMasterConfig((prev) => ({ ...prev, slides: updated }));
    setSelectedSlideIndex((prev) => Math.max(0, Math.min(prev, updated.length - 1)));
    addToast("Hero slide removed.", "info");
  };

  // Model image upload directly to backend / Cloudinary with fallback compression
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      addToast("Image file size must be under 10MB.", "warning");
      return;
    }

    setIsUploadingImage(true);
    addToast("Uploading model image to cloud/backend...", "info");

    try {
      // 1. Direct upload to server & Cloudinary
      const uploadedUrl = await uploadHeroImageFile(file);
      handleSlideChange("image", uploadedUrl);
      addToast("Model image uploaded to cloud successfully! Click 'SAVE & PUBLISH' to persist.", "success");
    } catch (uploadErr) {
      console.warn("Direct upload error, compressing locally:", uploadErr);
      if (uploadErr.response?.status === 401) {
        addToast("Admin session expired. Please log in again to upload model image to cloud.", "error");
      } else {
        addToast("Server upload issue. Compressing locally...", "warning");
      }

      // 2. Client-side canvas compression fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 1200;
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              const ratio = Math.min(maxDim / width, maxDim / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const isPng = file.type === "image/png";
            const compressedDataUrl = canvas.toDataURL(isPng ? "image/png" : "image/webp", 0.85);

            handleSlideChange("image", compressedDataUrl);
            addToast("Model image attached! Click 'SAVE & PUBLISH'.", "success");
          } catch (err) {
            handleSlideChange("image", event.target?.result);
            addToast("Model image attached! Click 'SAVE & PUBLISH'.", "success");
          }
        };
        img.src = event.target?.result;
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
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

  // Filter bottomwear cargo products for Tactical Drop Picker
  const cargoProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter((p) => {
      const text = [p.name, ...(p.category || []), ...(p.collection || [])]
        .join(" ")
        .toLowerCase();
      const isCargo =
        text.includes("cargo") ||
        text.includes("pant") ||
        text.includes("baggy") ||
        text.includes("jogger") ||
        text.includes("jean");
      const matchesSearch =
        !tacticalSearchTerm.trim() ||
        text.includes(tacticalSearchTerm.toLowerCase().trim());
      return isCargo && matchesSearch;
    });
  }, [products, tacticalSearchTerm]);

  // Tactical Drop Preview Properties
  const tacticalPreviewImage =
    masterConfig.tactical?.image ||
    cargoProducts[0]?.variants?.[0]?.images?.[0] ||
    cargoProducts[0]?.image ||
    "/collections/baggy_pants.png";

  const tacticalPreviewTitle =
    masterConfig.tactical?.title ||
    cargoProducts[0]?.name ||
    "SAMFOR PANT FOR MEN CASUAL FEEL CARGO JOGGERS FOR MEN";

  const tacticalPreviewPrice =
    masterConfig.tactical?.price ||
    cargoProducts[0]?.variants?.[0]?.salePrice ||
    cargoProducts[0]?.variants?.[0]?.price ||
    "479";

  const tacticalPreviewOriginalPrice =
    masterConfig.tactical?.originalPrice ||
    (cargoProducts[0]?.variants?.[0]?.salePrice
      ? cargoProducts[0]?.variants?.[0]?.price
      : "799");

  // Update Tactical Drop Field
  const handleTacticalChange = (field, val) => {
    setMasterConfig((prev) => ({
      ...prev,
      tactical: {
        ...(prev.tactical || DEFAULT_TACTICAL_DROP),
        [field]: val,
      },
    }));
  };

  // Select a product from store inventory for Tactical Bottomwear
  const handleSelectProductForTactical = (product) => {
    const img =
      product.variants?.[0]?.images?.[0] ||
      product.image ||
      "/collections/baggy_pants.png";
    const price =
      product.variants?.[0]?.salePrice || product.variants?.[0]?.price || 479;
    const origPrice = product.variants?.[0]?.salePrice
      ? product.variants?.[0]?.price
      : 799;

    setMasterConfig((prev) => ({
      ...prev,
      tactical: {
        ...(prev.tactical || DEFAULT_TACTICAL_DROP),
        title: product.name,
        price: String(price),
        originalPrice: String(origPrice),
        brand: product.brand || "GENZ ARCHIVE",
        image: img,
        link: `/products/${product._id}`,
        badgeText: "HEAVYWEIGHT 280 GSM",
        tag: "TRENDING CARGO",
        subtitle: "RAW ECRU • RELAXED FIT",
      },
    }));
    addToast(`Selected "${product.name}" for Bottomwear Tactical Drop!`, "info");
  };

  // Save changes to backend database & publish
  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveHeroMasterConfig(masterConfig);
      if (result?.backendError) {
        addToast(`Saved locally, but backend sync had issue: ${result.backendError}`, "warning");
      } else {
        addToast("Hero banner & text successfully saved to backend database!", "success");
      }
      setMasterConfig(result?.config || getHeroMasterConfig());
    } catch (err) {
      console.error("Error saving hero master config:", err);
      addToast(err.response?.data?.message || "Failed to save to backend. Please check connection.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (window.confirm("Reset all Hero Slides, Bento Cards, and Archived Lookbook to defaults?")) {
      setSaving(true);
      await resetHeroMasterConfig();
      setMasterConfig(getHeroMasterConfig());
      setSaving(false);
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
          <span>01 - Featured Studio Drops (Topwear & Tactical)</span>
          <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-orange-100 text-[#FF3B00]">
            2-Column
          </span>
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

                    <DualImageInput
                      label="Card Image"
                      value={card.image || ""}
                      onChange={(newUrl) => handleLookbookCardChange(idx, "image", newUrl)}
                      placeholder="https://images.unsplash.com/... or /models/model1.png"
                      helpText="Upload photo from device or paste direct image URL"
                    />
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
                    Upload a transparent model cutout photo or select a studio preset.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Cloud & DB Persisted
                </span>
              </div>

              <DualImageInput
                label="Slide Model Cutout Photo"
                value={activeSlide.image || ""}
                onChange={(newUrl) => handleSlideChange("image", newUrl)}
                placeholder="e.g. /models/model1.png or https://..."
                helpText="Upload a transparent model cutout from computer or paste direct image URL"
                presets={MODEL_PRESETS}
                products={products}
              />
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
      {/* TAB 3: 01 - FEATURED STUDIO DROPS (TOPWEAR & TACTICAL BOTTOMWEAR)         */}
      {/* ========================================================================= */}
      {activeTab === "spotlight" && (
        <div className="space-y-6">
          {/* Top Editorial Banner */}
          <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-6 border border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF3B00] uppercase">
                01 - STUDIO CURATED SHOWCASE
              </span>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mt-0.5">
                FEATURED TOPWEAR & TACTICAL BOTTOMWEAR
              </h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
                Configure both signature editorial drops side-by-side. Both cards support local image file upload (auto-synced to cloud backend) and direct URL input.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF3B00] hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50 shrink-0"
            >
              <Check size={15} strokeWidth={3} />
              <span>{saving ? "Publishing..." : "Save & Publish Drops"}</span>
            </button>
          </div>

          {/* 2-Column Side-by-Side Drop Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* =================================================================== */}
            {/* COLUMN 1: DROP 01 - TOPWEAR SPOTLIGHT (HOODIE / OVERSIZED TEE)       */}
            {/* =================================================================== */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-black">
                    01
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Drop 01: Topwear Spotlight
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                  Left Card
                </span>
              </div>

              {/* Quick Drop Category Switchers */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1-Click Category Drop Preset:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSpotlightChange("targetCategory", "hoodie");
                      handleSpotlightChange("badgeText", "HEAVYWEIGHT 380 GSM");
                      handleSpotlightChange("tagPill", "SIGNATURE FIT");
                      addToast("Set to Heavyweight Hoodie Drop", "info");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      masterConfig.spotlight?.targetCategory === "hoodie"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Flame size={14} className="mb-1 text-[#FF3B00]" />
                    <span className="text-[11px] font-black uppercase block">Hoodie Drop</span>
                    <span className="text-[9px] opacity-70">380 GSM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSpotlightChange("targetCategory", "tee");
                      handleSpotlightChange("badgeText", "HEAVYWEIGHT 240 GSM TEE");
                      handleSpotlightChange("tagPill", "DROP SPOTLIGHT");
                      addToast("Set to Heavyweight T-Shirt Drop", "info");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      masterConfig.spotlight?.targetCategory === "tee"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Shirt size={14} className="mb-1" />
                    <span className="text-[11px] font-black uppercase block">T-Shirt Drop</span>
                    <span className="text-[9px] opacity-70">240 GSM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSpotlightChange("targetCategory", "custom");
                      handleSpotlightChange("badgeText", "LIMITED ARCHIVAL DROP");
                      handleSpotlightChange("tagPill", "NEW DROP");
                      addToast("Set to Custom Archival Drop", "info");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      masterConfig.spotlight?.targetCategory === "custom"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Layers size={14} className="mb-1" />
                    <span className="text-[11px] font-black uppercase block">Custom Drop</span>
                    <span className="text-[9px] opacity-70">Archive</span>
                  </button>
                </div>
              </div>

              {/* Product Picker from Inventory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Or Select Product From Inventory:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={spotlightSearchTerm}
                      onChange={(e) => setSpotlightSearchTerm(e.target.value)}
                      placeholder="Filter..."
                      className="pl-7 pr-2.5 py-1 text-[11px] rounded-lg border border-gray-200 focus:border-black w-32"
                    />
                    <Search size={12} className="absolute left-2 top-2 text-gray-400" />
                  </div>
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-100 border border-gray-100 rounded-xl p-2 bg-gray-50/50">
                  {filteredProducts.slice(0, 8).map((prod) => {
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
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition text-left cursor-pointer ${
                          isSelected
                            ? "bg-neutral-900 text-white"
                            : "hover:bg-white text-neutral-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded overflow-hidden bg-white border border-gray-200 shrink-0 p-0.5">
                            <img src={img} alt="" className="h-full w-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold truncate">{prod.name}</p>
                            <p className={`text-[9px] ${isSelected ? "text-neutral-300" : "text-gray-400"}`}>
                              ₹{price}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topwear Dual Image Input (File Upload + URL) */}
              <DualImageInput
                label="Drop 01 Showcase Image"
                value={masterConfig.spotlight?.customImage || ""}
                onChange={(url) => handleSpotlightChange("customImage", url)}
                placeholder={spotlightPreviewImage}
                helpText="Upload garment PNG cutout from computer or paste direct image URL"
                products={products}
              />

              {/* Topwear Text Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Card Theme
                    </label>
                    <select
                      value={masterConfig.spotlight?.cardTheme || "dark"}
                      onChange={(e) => handleSpotlightChange("cardTheme", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold bg-white"
                    >
                      <option value="dark">Noir Black (Store Default)</option>
                      <option value="light">Studio White Paper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Specs Badge Text
                    </label>
                    <input
                      type="text"
                      value={masterConfig.spotlight?.badgeText || ""}
                      onChange={(e) => handleSpotlightChange("badgeText", e.target.value)}
                      placeholder="e.g. HEAVYWEIGHT 380 GSM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Right Tag Pill
                    </label>
                    <input
                      type="text"
                      value={masterConfig.spotlight?.tagPill || ""}
                      onChange={(e) => handleSpotlightChange("tagPill", e.target.value)}
                      placeholder="e.g. SIGNATURE FIT"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={masterConfig.spotlight?.customPrice || ""}
                      onChange={(e) => handleSpotlightChange("customPrice", e.target.value)}
                      placeholder={String(spotlightPreviewPrice)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Headline Title Override
                  </label>
                  <input
                    type="text"
                    value={masterConfig.spotlight?.title || ""}
                    onChange={(e) => handleSpotlightChange("title", e.target.value)}
                    placeholder={selectedProduct?.name || "TAGAS HOODIE FOR MEN SWEATSHIRT"}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-black uppercase bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Subtitle Spec Detail
                  </label>
                  <input
                    type="text"
                    value={masterConfig.spotlight?.subtitle || ""}
                    onChange={(e) => handleSpotlightChange("subtitle", e.target.value)}
                    placeholder="e.g. 280 GSM • RELAXED CUT"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase bg-white"
                  />
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* COLUMN 2: DROP 02 - TACTICAL BOTTOMWEAR (PARACHUTE CARGOS / JOGGERS) */}
            {/* =================================================================== */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-[#FF3B00] text-white flex items-center justify-center text-xs font-black">
                    02
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Drop 02: Tactical Bottomwear
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                  Right Card
                </span>
              </div>

              {/* Quick Cargo Drop Presets */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1-Click Bottomwear Preset:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleTacticalChange("title", "SAMFOR PANT FOR MEN CASUAL FEEL CARGO JOGGERS");
                      handleTacticalChange("badgeText", "HEAVYWEIGHT 280 GSM");
                      handleTacticalChange("tag", "TRENDING CARGO");
                      handleTacticalChange("price", "479");
                      handleTacticalChange("originalPrice", "799");
                      handleTacticalChange("subtitle", "RAW ECRU • RELAXED FIT");
                      handleTacticalChange("brand", "GENZ ARCHIVE");
                      handleTacticalChange("image", "/collections/baggy_pants.png");
                      handleTacticalChange("link", "/collections/cargos");
                      addToast("Applied Parachute Cargos Drop Preset", "info");
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left transition-all cursor-pointer"
                  >
                    <Layers size={14} className="mb-1 text-[#FF3B00]" />
                    <span className="text-[11px] font-black uppercase block">Parachute</span>
                    <span className="text-[9px] text-gray-500">₹479 • Ecru</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleTacticalChange("title", "TACTICAL RIPSTOP MULTI-POCKET PANTS");
                      handleTacticalChange("badgeText", "320 GSM RIPSTOP");
                      handleTacticalChange("tag", "TACTICAL DROP");
                      handleTacticalChange("price", "699");
                      handleTacticalChange("originalPrice", "1199");
                      handleTacticalChange("subtitle", "MIDNIGHT NOIR • TACTICAL FIT");
                      handleTacticalChange("brand", "GENZ ARCHIVE");
                      handleTacticalChange("link", "/collections/cargos");
                      addToast("Applied Tactical Ripstop Preset", "info");
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left transition-all cursor-pointer"
                  >
                    <Flame size={14} className="mb-1 text-neutral-800" />
                    <span className="text-[11px] font-black uppercase block">Ripstop</span>
                    <span className="text-[9px] text-gray-500">₹699 • Noir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleTacticalChange("title", "WIDE-LEG SKATER DENIM BAGGY JEANS");
                      handleTacticalChange("badgeText", "14 OZ RIGID DENIM");
                      handleTacticalChange("tag", "ARCHIVE DENIM");
                      handleTacticalChange("price", "899");
                      handleTacticalChange("originalPrice", "1499");
                      handleTacticalChange("subtitle", "VINTAGE WASH • OVERSIZED HEM");
                      handleTacticalChange("brand", "GENZ ARCHIVE");
                      handleTacticalChange("link", "/collections/cargos");
                      addToast("Applied Skater Baggy Denim Preset", "info");
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-left transition-all cursor-pointer"
                  >
                    <Tag size={14} className="mb-1 text-blue-600" />
                    <span className="text-[11px] font-black uppercase block">Baggy Jeans</span>
                    <span className="text-[9px] text-gray-500">₹899 • Denim</span>
                  </button>
                </div>
              </div>

              {/* Bottomwear Product Picker from Inventory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    Or Select Cargo From Inventory:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tacticalSearchTerm}
                      onChange={(e) => setTacticalSearchTerm(e.target.value)}
                      placeholder="Filter cargos..."
                      className="pl-7 pr-2.5 py-1 text-[11px] rounded-lg border border-gray-200 focus:border-black w-32"
                    />
                    <Search size={12} className="absolute left-2 top-2 text-gray-400" />
                  </div>
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-100 border border-gray-100 rounded-xl p-2 bg-gray-50/50">
                  {cargoProducts.slice(0, 8).map((prod) => {
                    const img =
                      prod.variants?.[0]?.images?.[0] || prod.image || "/collections/baggy_pants.png";
                    const price = prod.variants?.[0]?.salePrice || prod.variants?.[0]?.price || 479;

                    return (
                      <button
                        key={prod._id}
                        type="button"
                        onClick={() => handleSelectProductForTactical(prod)}
                        className="w-full flex items-center justify-between p-2 rounded-lg transition text-left cursor-pointer hover:bg-white text-neutral-800"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded overflow-hidden bg-white border border-gray-200 shrink-0 p-0.5">
                            <img src={img} alt="" className="h-full w-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold truncate">{prod.name}</p>
                            <p className="text-[9px] text-gray-400">₹{price}</p>
                          </div>
                        </div>
                        <Plus size={14} className="text-gray-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tactical Dual Image Input (File Upload + URL) */}
              <DualImageInput
                label="Drop 02 Cargo Showcase Image"
                value={masterConfig.tactical?.image || ""}
                onChange={(url) => handleTacticalChange("image", url)}
                placeholder="/collections/baggy_pants.png"
                helpText="Upload bottomwear PNG cutout from computer or paste direct image URL"
                products={cargoProducts.length > 0 ? cargoProducts : products}
              />

              {/* Tactical Text Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Specs Badge Text
                    </label>
                    <input
                      type="text"
                      value={masterConfig.tactical?.badgeText || "HEAVYWEIGHT 280 GSM"}
                      onChange={(e) => handleTacticalChange("badgeText", e.target.value)}
                      placeholder="e.g. HEAVYWEIGHT 280 GSM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Right Tag Pill
                    </label>
                    <input
                      type="text"
                      value={masterConfig.tactical?.tag || "TRENDING CARGO"}
                      onChange={(e) => handleTacticalChange("tag", e.target.value)}
                      placeholder="e.g. TRENDING CARGO"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Sale Price (₹)
                    </label>
                    <input
                      type="number"
                      value={masterConfig.tactical?.price || "479"}
                      onChange={(e) => handleTacticalChange("price", e.target.value)}
                      placeholder="479"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Strike Price (₹)
                    </label>
                    <input
                      type="number"
                      value={masterConfig.tactical?.originalPrice || "799"}
                      onChange={(e) => handleTacticalChange("originalPrice", e.target.value)}
                      placeholder="799"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Brand / Studio
                    </label>
                    <input
                      type="text"
                      value={masterConfig.tactical?.brand || "GENZ ARCHIVE"}
                      onChange={(e) => handleTacticalChange("brand", e.target.value)}
                      placeholder="GENZ ARCHIVE"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Cargo Headline Title
                  </label>
                  <input
                    type="text"
                    value={masterConfig.tactical?.title || "SAMFOR PANT FOR MEN CASUAL FEEL CARGO JOGGERS"}
                    onChange={(e) => handleTacticalChange("title", e.target.value)}
                    placeholder="SAMFOR PANT FOR MEN CASUAL FEEL CARGO JOGGERS"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-black uppercase bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Subtitle Spec Detail
                    </label>
                    <input
                      type="text"
                      value={masterConfig.tactical?.subtitle || "RAW ECRU • RELAXED FIT"}
                      onChange={(e) => handleTacticalChange("subtitle", e.target.value)}
                      placeholder="RAW ECRU • RELAXED FIT"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-bold uppercase bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={masterConfig.tactical?.link || "/collections/cargos"}
                      onChange={(e) => handleTacticalChange("link", e.target.value)}
                      placeholder="/collections/cargos"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-black text-xs font-mono bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LIVE STOREFRONT PREVIEW: EXACT 2-COLUMN SHOWCASE REPLICA                  */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Eye size={15} className="text-emerald-500" />
                  Live Storefront 2-Column Showcase Preview
                </span>
                <p className="text-[11px] text-gray-400 font-medium">
                  Exact visual replica of the homepage section.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-[#FF3B00] text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Check size={14} className="text-emerald-400" />
                <span>{saving ? "Publishing..." : "Save Showcase Changes"}</span>
              </button>
            </div>

            {/* 2-Column Editorial Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch pt-2">
              {/* Drop 01: Spotlight Card Preview */}
              {(() => {
                const isLight = masterConfig.spotlight?.cardTheme === "light";
                const badge = masterConfig.spotlight?.badgeText || "HEAVYWEIGHT 380 GSM";
                const tag = masterConfig.spotlight?.tagPill || "SIGNATURE FIT";
                const title = masterConfig.spotlight?.title || spotlightPreviewTitle;
                const price = masterConfig.spotlight?.customPrice || spotlightPreviewPrice;
                const subtitle = masterConfig.spotlight?.subtitle || "280 GSM • RELAXED CUT";
                const img = masterConfig.spotlight?.customImage || spotlightPreviewImage;

                return (
                  <div
                    className={`relative rounded-none border p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all shadow-xs ${
                      isLight
                        ? "bg-white text-neutral-950 border-neutral-200"
                        : "bg-neutral-950 text-white border-neutral-800"
                    }`}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isLight
                            ? "bg-neutral-100 text-neutral-800 border border-neutral-200"
                            : "bg-white/10 text-neutral-200 border border-white/10"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-none bg-[#FF3B00]" />
                        {badge}
                      </span>
                      <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#FF3B00]">
                        {tag}
                      </span>
                    </div>

                    {/* Image Area */}
                    <div
                      className={`relative w-full flex-1 min-h-[150px] max-h-[185px] my-2.5 rounded-none overflow-hidden flex items-center justify-center p-3 shadow-2xs border ${
                        isLight
                          ? "bg-neutral-50 border-neutral-200/50"
                          : "bg-neutral-900 border-neutral-800"
                      }`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                      <img
                        src={formatHeroImageUrl(img)}
                        alt={title}
                        className="h-full w-full object-contain mix-blend-multiply select-none"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/models/model1.png";
                        }}
                      />
                      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-none bg-black text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                          DROP SPOTLIGHT
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 z-10 pointer-events-none">
                        <span className="px-1.5 py-0.5 rounded-none bg-[#FF3B00] text-[9px] font-mono font-black text-white uppercase tracking-wider">
                          NEW
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col space-y-1 z-10">
                      <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest truncate">
                        TAGAS • UNISEX
                      </p>
                      <h4 className="text-sm sm:text-base font-black uppercase tracking-tight line-clamp-1">
                        {title}
                      </h4>
                      <div className="flex items-baseline gap-2.5 pt-0.5">
                        <span className="text-lg sm:text-xl font-mono font-black text-[#FF3B00]">
                          ₹{price}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase">
                          {subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div
                      className={`flex items-center justify-between pt-3 mt-2 border-t z-10 ${
                        isLight ? "border-neutral-200" : "border-neutral-800"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                        CLICK TO INSPECT SILHOUETTE
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-black">
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Drop 02: Tactical Bottomwear Preview */}
              {(() => {
                const badge = masterConfig.tactical?.badgeText || "HEAVYWEIGHT 280 GSM";
                const tag = masterConfig.tactical?.tag || "TRENDING CARGO";
                const brand = masterConfig.tactical?.brand || "GENZ ARCHIVE";
                const title = masterConfig.tactical?.title || tacticalPreviewTitle;
                const price = masterConfig.tactical?.price || tacticalPreviewPrice;
                const origPrice = masterConfig.tactical?.originalPrice || tacticalPreviewOriginalPrice;
                const subtitle = masterConfig.tactical?.subtitle || "RAW ECRU • RELAXED FIT";
                const img = masterConfig.tactical?.image || tacticalPreviewImage;

                return (
                  <div className="relative rounded-none border border-neutral-200/90 bg-white text-neutral-950 p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all shadow-xs">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
                        <span className="h-1.5 w-1.5 rounded-none bg-[#FF3B00]" />
                        {badge}
                      </span>
                      <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#FF3B00]">
                        {tag}
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative w-full flex-1 min-h-[150px] max-h-[185px] my-2.5 rounded-none overflow-hidden bg-neutral-50 border border-neutral-200/50 flex items-center justify-center p-3 shadow-2xs">
                      <div className="absolute inset-0 bg-[radial-gradient(#0000000c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                      <img
                        src={formatHeroImageUrl(img)}
                        alt={title}
                        className="h-full w-full object-contain mix-blend-multiply select-none"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/collections/baggy_pants.png";
                        }}
                      />
                      <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-none bg-neutral-900/90 text-[9px] font-mono font-bold text-white uppercase tracking-wider border border-white/10">
                          BOTTOMWEAR RADAR
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 z-10 pointer-events-none">
                        <span className="px-1.5 py-0.5 rounded-none bg-black text-[9px] font-mono font-black text-white uppercase tracking-wider">
                          HOT DROP
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col space-y-1 z-10">
                      <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest truncate">
                        {brand} • UNISEX
                      </p>
                      <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950 line-clamp-1">
                        {title}
                      </h4>
                      <div className="flex items-baseline gap-2.5 pt-0.5">
                        <span className="text-lg sm:text-xl font-mono font-black text-[#FF3B00]">
                          ₹{price}
                        </span>
                        {origPrice && (
                          <span className="text-xs font-mono text-neutral-400 line-through">
                            ₹{origPrice}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase">
                          {subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-200 z-10">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                        CLICK TO INSPECT SILHOUETTE
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-none bg-black text-white">
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroShowcaseEdit;
