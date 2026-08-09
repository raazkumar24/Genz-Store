import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { updateProduct, createProduct } from "../services/productService";
import { useToast } from "../context/ToastContext";
import { BackButton } from "../components/ui";
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
} from "lucide-react";

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById, replaceProduct, addProduct } = useProducts();

  const isNewProduct = !productId;
  const product = isNewProduct ? null : getProductById(productId);
  const { addToast } = useToast();

  //product form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gender: "Men",
    category: "",
    collection: "",
    brand: "",
    topHighlights: "",
    itemDetails: "",
  });

  const [variants, setVariants] = useState([]);
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeImageModalVariantIndex, setActiveImageModalVariantIndex] =
    useState(null);

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

  useEffect(() => {
    if (isNewProduct) return;

    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        gender: product.gender || "Men",
        category: Array.isArray(product.category) ? product.category.join(", ") : (product.category || ""),
        collection: Array.isArray(product.collection) ? product.collection.join(", ") : (product.collection || ""),
        brand: product.brand || "",
        topHighlights: product.productDetails?.topHighlights?.join("\n") || "",
        itemDetails: product.productDetails?.itemDetails || "",
      });
      setVariants(product.variants || []);
      setSpecifications(
        product.productDetails?.specifications?.length > 0
          ? product.productDetails.specifications
          : [{ key: "", value: "" }],
      );
    }
  }, [product, isNewProduct]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantChange = (index, field, value, type = "text") => {
    const updatedVariants = [...variants];
    if (type === "checkbox") {
      updatedVariants[index][field] = value;
    } else if (
      field === "stock" ||
      field === "price" ||
      field === "salePrice"
    ) {
      updatedVariants[index][field] = value === "" ? "" : Number(value);
    } else {
      updatedVariants[index][field] = value;
    }
    setVariants(updatedVariants);
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpec = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpec = (indexToRemove) => {
    setSpecifications(
      specifications.filter((_, index) => index !== indexToRemove),
    );
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        stock: "",
        price: "",
        salePrice: "",
        isSale: false,
        isTrending: false,
        isNewArrival: false,
        keywords: "",
        imageFiles: [],
      },
    ]);
  };

  const removeVariant = (indexToRemove) => {
    setVariants(variants.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (variants.length === 0) {
      setError("Please add at least one variant to set price and images.");
      setSaving(false);
      return;
    }

    // We are deprecating the strict description requirement, but we can set it to the item details or empty
    if (!formData.name.trim()) {
      setError("Product Name is required.");
      setSaving(false);
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.size) {
        setError(`Variant #${i + 1} requires at least one Size.`);
        setSaving(false);
        return;
      }
      if (!v.color || !v.color.trim()) {
        setError(`Variant #${i + 1} requires a Colour.`);
        setSaving(false);
        return;
      }
      if (v.price === undefined || v.price === "" || v.price <= 0) {
        setError(`Variant #${i + 1} requires a valid Price.`);
        setSaving(false);
        return;
      }
      if (v.stock === undefined || v.stock === "" || v.stock < 0) {
        setError(`Variant #${i + 1} requires a valid Stock quantity.`);
        setSaving(false);
        return;
      }
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("gender", formData.gender);
      if (formData.brand) payload.append("brand", formData.brand);
      
      if (formData.category) {
        const categoryArray = formData.category.split(",").map(c => c.trim()).filter(Boolean);
        payload.append("category", JSON.stringify(categoryArray));
      }
      
      if (formData.collection) {
        const collectionArray = formData.collection.split(",").map(c => c.trim()).filter(Boolean);
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
        // Sanitize numbers to prevent Mongoose CastError on empty strings
        rest.salePrice = rest.salePrice === "" ? 0 : Number(rest.salePrice);
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
        addToast("Product created successfully", "success");
        navigate("/admin/products");
      } else {
        const updatedProduct = await updateProduct(productId, payload);
        replaceProduct(updatedProduct);
        addToast("Product updated successfully", "success");
        navigate("/admin/products");
      }
    } catch (submitError) {
      console.error("Product save failed:", submitError);
      let errorMessage = "Failed to save product. Please check API connection.";
      if (submitError.response?.data) {
        const data = submitError.response.data;
        errorMessage = data.error || data.message || errorMessage;
      }
      setError(errorMessage);
      addToast(errorMessage, "error");
    } finally {
      if (!isNewProduct) setSaving(false);
    }
  };

  if (!isNewProduct && !product) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="h-16 w-16 mb-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center shadow-sm">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="mt-2 text-sm text-gray-500">
          The product you are trying to edit doesn't exist.
        </p>
        <Link
          to="/admin/products"
          className="mt-6 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
        >
          Go back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto pb-24 min-w-0">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton fallbackPath="/admin/products" text="Back" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isNewProduct ? "Add Product" : "Edit Product"}
            </h2>
            <p className="text-sm text-gray-500">
              {isNewProduct
                ? "Setup a new item for the store."
                : `Modifying ${product.name}`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Core Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 text-lg font-bold text-gray-900">
                <FileText size={20} className="text-gray-400" />
                Core Info
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Premium Cotton T-Shirt"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Veirdo"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Top Highlights (One per line)
                  </label>
                  <textarea
                    name="topHighlights"
                    value={formData.topHighlights}
                    onChange={handleChange}
                    placeholder="e.g. 100% Cotton&#10;Machine Washable&#10;Oversized Fit"
                    rows="3"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-y"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Specifications (Key / Value)
                    </label>
                    <button
                      type="button"
                      onClick={addSpec}
                      className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-blue-700 transition-colors"
                    >
                      <Plus size={16} /> Add Spec
                    </button>
                  </div>
                  <div className="space-y-3">
                    {specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                      >
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) =>
                            handleSpecChange(index, "key", e.target.value)
                          }
                          placeholder="e.g., Fit Type"
                          className="w-full sm:flex-1 rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecChange(index, "value", e.target.value)
                          }
                          placeholder="e.g., Oversized"
                          className="w-full sm:flex-1 rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                        />
                        {specifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpec(index)}
                            className="self-end sm:self-auto p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Item Details
                  </label>
                  <textarea
                    name="itemDetails"
                    value={formData.itemDetails}
                    onChange={handleChange}
                    placeholder="Detailed description of the product..."
                    rows="4"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-y"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Organization */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4 text-lg font-bold text-gray-900">
                <Tag size={20} className="text-gray-400" />
                Organization
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Gender Target
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all font-semibold"
                  >
                    <option value="Men">Men (Male)</option>
                    <option value="Women">Women (Female)</option>
                    <option value="Unisex">Unisex (Both)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Collections (Comma Separated)
                  </label>
                  <input
                    type="text"
                    name="collection"
                    value={formData.collection}
                    onChange={handleChange}
                    placeholder="e.g., Oversized Tees, Hoodies, Cargos, Trending"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter any tags where this product should appear (e.g. Oversized Tees, Hoodies, Cargos).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Section moved to bottom */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm mt-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 flex-1 min-w-0">
              <Layers size={20} className="text-gray-400 shrink-0" />
              <span className="truncate">Variants (Sizes, Colours & More)</span>
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <PlusCircle size={16} />
              Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variants.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                No variants added. Add specific sizes, colours, and overrides
                for this product.
              </div>
            ) : (
              <div className="grid gap-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
                      {/* Image Thumbnail */}
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveImageModalVariantIndex(index);
                          }}
                          className="cursor-pointer flex items-center justify-center h-14 w-14 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 overflow-hidden relative group transition-colors"
                        >
                          {variant.imageFiles &&
                          variant.imageFiles.length > 0 ? (
                            <img
                              src={URL.createObjectURL(variant.imageFiles[0])}
                              alt="Variant"
                              className="h-full w-full object-cover"
                            />
                          ) : variant.images && variant.images.length > 0 ? (
                            <img
                              src={variant.images[0]}
                              alt="Variant"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} className="text-gray-400" />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                              Edit
                            </span>
                          </div>

                          {/* Badge for multiple images */}
                          {(variant.imageFiles?.length || 0) +
                            (variant.images?.length || 0) >
                            1 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">
                              {(variant.imageFiles?.length || 0) +
                                (variant.images?.length || 0)}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Main Variant Inputs */}
                      <div className="flex-1 flex flex-col gap-3 w-full">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500">
                            Sizes
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {PREDEFINED_SIZES.map((s) => {
                              const currentSizes = (variant.size || "")
                                .split(",")
                                .map((sz) => sz.trim())
                                .filter(Boolean);
                              const isSelected = currentSizes.includes(s);
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newSizes = isSelected
                                      ? currentSizes.filter((sz) => sz !== s)
                                      : [...currentSizes, s];
                                    handleVariantChange(
                                      index,
                                      "size",
                                      newSizes.join(", "),
                                    );
                                  }}
                                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all border ${
                                    isSelected
                                      ? "border-gray-900 bg-gray-900 text-white"
                                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                  }`}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                              Colour
                            </label>
                            <input
                              type="text"
                              value={variant.color}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "color",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. Black"
                              className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "price",
                                  e.target.value,
                                )
                              }
                              min="0"
                              className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                              Stock
                            </label>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "stock",
                                  e.target.value,
                                )
                              }
                              min="0"
                              className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="shrink-0 self-start md:self-center">
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Remove Variant"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Variant Specific Overrides (Sale, Trending, Keywords) */}
                    <div className="pl-0 md:pl-[4.5rem] grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
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
                            className="h-3.5 w-3.5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-xs font-medium text-gray-600">
                            Variant Sale
                          </span>
                        </label>
                        {variant.isSale && (
                          <div className="flex-1 max-w-24">
                            <input
                              type="number"
                              value={variant.salePrice || ""}
                              onChange={(e) =>
                                handleVariantChange(
                                  index,
                                  "salePrice",
                                  e.target.value,
                                )
                              }
                              min="0"
                              placeholder="Sale ₹"
                              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
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
                            className="h-3.5 w-3.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          />
                          <span className="text-xs font-medium text-gray-600">
                            Trending Variant
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
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
                            className="h-3.5 w-3.5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          />
                          <span className="text-xs font-medium text-gray-600">
                            New Arrival
                          </span>
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={variant.keywords || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "keywords",
                              e.target.value,
                            )
                          }
                          placeholder="Keywords (comma separated)"
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Save Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 z-20 flex items-center justify-end gap-3 border-t border-gray-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-4">
          <Link
            to="/admin/products"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} />{" "}
                {isNewProduct ? "Create Product" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Image Upload Modal */}
      {activeImageModalVariantIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3
                  className="text-lg font-black uppercase tracking-tight text-gray-900"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Manage Images
                </h3>
                <p className="text-xs font-medium text-gray-500">
                  Variant #{activeImageModalVariantIndex + 1}
                </p>
              </div>
              <button
                onClick={() => setActiveImageModalVariantIndex(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Drag & Drop Zone */}
              <div
                className="w-full border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center py-12 px-6 transition-colors hover:bg-gray-100 hover:border-gray-400 group relative cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(
                    "border-[var(--color-primary)]",
                    "bg-blue-50",
                  );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-[var(--color-primary)]",
                    "bg-blue-50",
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-[var(--color-primary)]",
                    "bg-blue-50",
                  );
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const currentVariant =
                      variants[activeImageModalVariantIndex];
                    handleVariantChange(
                      activeImageModalVariantIndex,
                      "imageFiles",
                      [
                        ...(currentVariant.imageFiles || []),
                        ...Array.from(e.dataTransfer.files),
                      ],
                    );
                  }
                }}
              >
                <div className="h-16 w-16 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud
                    size={28}
                    className="text-gray-400 group-hover:text-[var(--color-primary)] transition-colors"
                  />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-1">
                  Click or drag images here
                </h4>
                <p className="text-xs font-medium text-gray-500">
                  Supports JPG, PNG, WEBP (Max 5MB each)
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const currentVariant =
                        variants[activeImageModalVariantIndex];
                      handleVariantChange(
                        activeImageModalVariantIndex,
                        "imageFiles",
                        [
                          ...(currentVariant.imageFiles || []),
                          ...Array.from(e.target.files),
                        ],
                      );
                    }
                    // Reset input so the same files can be selected again if needed
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Image Grid */}
              {(() => {
                const currentVariant = variants[activeImageModalVariantIndex];
                const hasExistingImages =
                  currentVariant.images && currentVariant.images.length > 0;
                const hasNewImages =
                  currentVariant.imageFiles &&
                  currentVariant.imageFiles.length > 0;

                if (!hasExistingImages && !hasNewImages) return null;

                return (
                  <div className="mt-8">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                      Uploaded Images
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {/* Existing URLs (from DB) */}
                      {hasExistingImages &&
                        currentVariant.images.map((url, i) => (
                          <div
                            key={`url-${i}`}
                            className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden border border-gray-200 group"
                          >
                            <img
                              src={url}
                              alt={`Existing ${i}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newUrls = [...currentVariant.images];
                                  newUrls.splice(i, 1);
                                  handleVariantChange(
                                    activeImageModalVariantIndex,
                                    "images",
                                    newUrls,
                                  );
                                }}
                                className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}

                      {/* New Files (Pending Upload) */}
                      {hasNewImages &&
                        currentVariant.imageFiles.map((file, i) => (
                          <div
                            key={`file-${i}`}
                            className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden border border-gray-200 group"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New ${i}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm z-10">
                              New
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newFiles = [
                                    ...currentVariant.imageFiles,
                                  ];
                                  newFiles.splice(i, 1);
                                  handleVariantChange(
                                    activeImageModalVariantIndex,
                                    "imageFiles",
                                    newFiles,
                                  );
                                }}
                                className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <button
                type="button"
                onClick={() => setActiveImageModalVariantIndex(null)}
                className="rounded-xl bg-gray-900 px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
