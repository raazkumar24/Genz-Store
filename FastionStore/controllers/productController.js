import Product from "../models/Product.js";
import { defaultProducts } from "../data/defaultProducts.js";

// In-memory working copy initialized with default products
let inMemoryProducts = JSON.parse(JSON.stringify(defaultProducts));

// Helper to parse strings/arrays into clean unique string arrays
function parseArrayField(input) {
  if (!input) return [];
  
  let rawItems = [];
  
  if (Array.isArray(input)) {
    rawItems = input;
  } else if (typeof input === 'string') {
    let str = input.trim();
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          rawItems = parsed;
        } else {
          rawItems = [parsed];
        }
      } catch (e) {
        str = str.slice(1, -1);
        rawItems = str.split(',');
      }
    } else {
      rawItems = str.split(',');
    }
  }

  const result = [];
  for (let item of rawItems) {
    if (typeof item === 'string') {
      let cleanStr = item.replace(/^[\[\"\'\s\\]+|[\]\"\'\s\\]+$/g, '').trim();
      if (cleanStr.includes(',')) {
        cleanStr.split(',').forEach(sub => {
          const subClean = sub.replace(/^[\[\"\'\s\\]+|[\]\"\'\s\\]+$/g, '').trim();
          if (subClean) result.push(subClean);
        });
      } else if (cleanStr) {
        result.push(cleanStr);
      }
    } else if (item) {
      result.push(String(item).trim());
    }
  }
  
  return [...new Set(result)];
}

// Standard Streetwear Color Hex mapping
// Comprehensive Streetwear Color Hex Palette with synonyms & fuzzy matching
const COLOR_HEX_MAP = {
  black: "#111111",
  white: "#FFFFFF",
  gray: "#6B7280",
  grey: "#6B7280",
  charcoal: "#374151",
  slate: "#475569",
  beige: "#D4B996",
  khaki: "#C3B091",
  sand: "#E5D3B3",
  cream: "#FFFDD0",
  olive: "#4D7C0F",
  green: "#22C55E",
  sage: "#8A9A86",
  forest: "#166534",
  blue: "#2563EB",
  navy: "#1E3A8A",
  cobalt: "#1D4ED8",
  cyan: "#06B6D4",
  teal: "#14B8A6",
  red: "#EF4444",
  crimson: "#DC2626",
  maroon: "#881337",
  orange: "#F97316",
  rust: "#C2410C",
  yellow: "#EAB308",
  mustard: "#D97706",
  amber: "#F59E0B",
  lime: "#84CC16",
  pink: "#EC4899",
  rose: "#F43F5E",
  purple: "#A855F7",
  lavender: "#C084FC",
  brown: "#92400E",
  tan: "#D2B48C",
  mocha: "#78350F",
};

// Canonical Streetwear Palette definitions (guarantees each color appears at most ONCE)
export const CANONICAL_PALETTES = [
  { key: "black", name: "Black", hex: "#111111", keywords: ["black", "noir", "dark", "jet", "pitch"] },
  { key: "white", name: "White", hex: "#FFFFFF", keywords: ["white", "ivory", "snow", "swanwhite"] },
  { key: "blue", name: "Blue", hex: "#2563EB", keywords: ["blue", "navy", "cobalt", "cyan", "teal", "indigo", "sky", "denim"] },
  { key: "red", name: "Red", hex: "#EF4444", keywords: ["red", "crimson", "wine", "maroon", "burgundy", "ruby", "scarlet", "cherry"] },
  { key: "brown", name: "Brown", hex: "#78350F", keywords: ["brown", "coffee", "mocha", "chocolate", "espresso", "cocoa"] },
  { key: "green", name: "Green", hex: "#4D7C0F", keywords: ["green", "olive", "sage", "forest", "emerald", "lime", "mint"] },
  { key: "grey", name: "Grey", hex: "#6B7280", keywords: ["grey", "gray", "charcoal", "slate", "ash", "silver"] },
  { key: "beige", name: "Beige", hex: "#D4B996", keywords: ["beige", "cream", "khaki", "sand", "tan", "nude", "wheat"] },
  { key: "orange", name: "Orange", hex: "#F97316", keywords: ["orange", "rust", "tangerine", "peach", "coral"] },
  { key: "purple", name: "Purple", hex: "#A855F7", keywords: ["purple", "lavender", "violet", "lilac", "plum"] },
  { key: "yellow", name: "Yellow", hex: "#EAB308", keywords: ["yellow", "mustard", "amber", "gold"] },
  { key: "pink", name: "Pink", hex: "#EC4899", keywords: ["pink", "rose", "fuchsia", "magenta"] },
];

/**
 * Normalizes any freeform variant color string (e.g. "Giyu - BLACK", "Solo Leveling - BLACK", "Luffy - WHITE")
 * to its canonical base color family so duplicate circles are NEVER created.
 */
export function canonicalizeColor(colorInput) {
  if (!colorInput) return null;
  const str = String(colorInput).trim().toLowerCase();

  // 1. Direct keyword match in canonical palettes
  for (const palette of CANONICAL_PALETTES) {
    if (palette.key === str || palette.keywords.some((kw) => str.includes(kw))) {
      return palette;
    }
  }

  // 2. Substring matching in COLOR_HEX_MAP
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (str.includes(key)) {
      return {
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        hex,
        keywords: [key],
      };
    }
  }

  // 3. Fallback clean word
  const cleanWord = str.split(/[^a-zA-Z0-9#]+/)[0] || str;
  return {
    key: cleanWord.toLowerCase(),
    name: cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1),
    hex: resolveColorHex(str),
    keywords: [cleanWord.toLowerCase()],
  };
}

// Smart Hex Resolver: supports exact match, hex strings, and substring keywords
function resolveColorHex(colorInput) {
  if (!colorInput) return "#111111";
  const str = String(colorInput).trim().toLowerCase();

  // 1. If color string is already a hex code (e.g. #2563eb)
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str)) {
    return str;
  }

  // 2. Direct exact match
  if (COLOR_HEX_MAP[str]) {
    return COLOR_HEX_MAP[str];
  }

  // 3. Substring matching (e.g. "dark olive green" -> "olive" -> "#4D7C0F")
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (str.includes(key)) {
      return hex;
    }
  }

  // 4. Curated distinct street hues fallback instead of generic grey
  const fallbackHues = ["#2563EB", "#F97316", "#84CC16", "#EF4444", "#4D7C0F", "#A855F7", "#06B6D4"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return fallbackHues[Math.abs(hash) % fallbackHues.length];
}

/**
 * Controller: Get dynamic popular color palette from live products
 * Groups variants into canonical color families so each color (Black, White, Blue, etc.)
 * appears EXACTLY ONCE with clean labels and aggregated drop counts.
 */
export const getPopularColors = async (req, res) => {
  try {
    let products = [];
    try {
      products = await Product.find({}).lean();
    } catch (e) {
      // Fallback to in-memory if DB offline
    }
    if (!products || products.length === 0) {
      products = inMemoryProducts;
    }

    // Map each product to its canonical colors (1 count per product per canonical color)
    const counts = {};
    for (const p of CANONICAL_PALETTES) {
      counts[p.key] = 0;
    }

    for (const product of products) {
      if (Array.isArray(product.variants)) {
        const productColors = new Set();
        for (const variant of product.variants) {
          if (variant.color) {
            const canonical = canonicalizeColor(variant.color);
            if (canonical && canonical.key) {
              productColors.add(canonical.key);
            }
          }
        }
        for (const cKey of productColors) {
          counts[cKey] = (counts[cKey] || 0) + 1;
        }
      }
    }

    // Build the list of active canonical colors
    const activeColors = CANONICAL_PALETTES
      .filter((p) => (counts[p.key] || 0) > 0)
      .map((p) => ({
        name: p.name,
        color: p.key,
        filter: p.key,
        hex: p.hex,
        count: counts[p.key],
      }))
      .sort((a, b) => b.count - a.count);

    // If fewer than 8, pad with curated defaults so Bento card has 8 distinct circles, NEVER duplicate!
    const resultList = [...activeColors];
    const seen = new Set(resultList.map((c) => c.color));

    for (const p of CANONICAL_PALETTES) {
      if (resultList.length >= 8) break;
      if (!seen.has(p.key)) {
        resultList.push({
          name: p.name,
          color: p.key,
          filter: p.key,
          hex: p.hex,
          count: counts[p.key] || 0,
        });
        seen.add(p.key);
      }
    }

    return res.json(resultList.slice(0, 8));
  } catch (error) {
    console.error("Error in getPopularColors:", error);
    res.status(500).json({ message: "Failed to fetch popular colors" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { color, category, gender, search, onSale } = req.query;

    let products = [];
    try {
      products = await Product.find({}).lean();
    } catch (error) {
      // Database offline or query error, fall through to inMemoryProducts
    }

    if (!products || products.length === 0) {
      products = inMemoryProducts;
    }

    let filtered = products;

    // 1. Color filter (matches canonical family as well as substring)
    if (color && color !== "all") {
      const c = color.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        p.variants && p.variants.some((v) => {
          const vStr = String(v.color || "").toLowerCase().trim();
          const canonical = canonicalizeColor(vStr);
          return (
            vStr.includes(c) ||
            c.includes(vStr) ||
            (canonical && canonical.key === c)
          );
        })
      );
    }

    // 2. Category filter
    if (category && category !== "all") {
      const cat = category.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const collections = Array.isArray(p.collection)
          ? p.collection.join(" ").toLowerCase()
          : String(p.collection || "").toLowerCase();
        const cats = Array.isArray(p.category)
          ? p.category.join(" ").toLowerCase()
          : String(p.category || "").toLowerCase();
        const name = String(p.name || "").toLowerCase();
        return collections.includes(cat) || cats.includes(cat) || name.includes(cat);
      });
    }

    // 3. Gender filter
    if (gender && gender !== "all") {
      const g = gender.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const pg = String(p.gender || "").toLowerCase();
        return pg === g || pg === "unisex";
      });
    }

    // 4. On-Sale filter
    if (onSale === "true") {
      filtered = filtered.filter(
        (p) => p.isSale || (p.variants && p.variants.some((v) => v.isSale || (v.salePrice && v.salePrice > 0)))
      );
    }

    // 5. Search query filter
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const text = [p.name, p.description, p.brand].join(" ").toLowerCase();
        const varText = (p.variants || [])
          .map((v) => [v.color, v.size, ...(v.keywords || [])].join(" "))
          .join(" ")
          .toLowerCase();
        return text.includes(s) || varText.includes(s);
      });
    }

    return res.json(filtered);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).lean();
    if (product) {
      return res.json(product);
    }
  } catch (error) {
    // Fallback to in-memory lookup
  }
  
  const found = inMemoryProducts.find(p => p._id === productId || String(p._id) === String(productId));
  if (found) {
    return res.json(found);
  }
  res.status(404).json({ message: 'Product not found' });
};

export const addProduct = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is empty or not parsed." });
  }
  const { name, description, brand, gender, category, variants, collection, productDetails, material, fit, gsm } = req.body;

  try {
    let parsedVariants = variants;
    if (typeof variants === 'string') {
      parsedVariants = JSON.parse(variants);
    }

    let parsedProductDetails = productDetails;
    if (typeof productDetails === 'string') {
      parsedProductDetails = JSON.parse(productDetails);
    }

    let parsedCategory = parseArrayField(category);
    if (parsedCategory.length === 0) parsedCategory = ['Uncategorized'];

    let parsedCollection = parseArrayField(collection);

    const resolvedMaterial = material || parsedProductDetails?.material || '';
    const resolvedFit = fit || parsedProductDetails?.fit || '';
    const resolvedGsm = gsm || parsedProductDetails?.gsm || '';

    // Map variant specific images
    if (req.files && req.files.length > 0 && parsedVariants && parsedVariants.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname && file.fieldname.startsWith('variantImage_')) {
          const index = parseInt(file.fieldname.split('_')[1]);
          if (parsedVariants[index]) {
            if (!parsedVariants[index].images) parsedVariants[index].images = [];
            parsedVariants[index].images.push(file.secure_url || file.path || file.url);
          }
        }
      });
    }

    // Ensure variants have _id
    if (Array.isArray(parsedVariants)) {
      parsedVariants = parsedVariants.map((v, i) => ({
        ...v,
        _id: v._id || `var-${Date.now()}-${i}`
      }));
    }

    const productPayload = {
      _id: `prod-${Date.now()}`,
      name,
      description: description || '',
      brand: brand || '',
      gender: gender || 'Men',
      material: resolvedMaterial,
      fit: resolvedFit,
      gsm: resolvedGsm,
      category: parsedCategory,
      collection: parsedCollection,
      variants: parsedVariants || [],
      productDetails: {
        ...(parsedProductDetails || {}),
        material: resolvedMaterial,
        fit: resolvedFit,
        gsm: resolvedGsm,
      },
    };

    try {
      const product = new Product(productPayload);
      await product.save();
      inMemoryProducts.unshift(product.toObject());
      return res.status(201).json({ message: 'Product added successfully 🎉', product });
    } catch (dbErr) {
      console.warn("MongoDB Product save warning, kept in memory store:", dbErr.message);
      inMemoryProducts.unshift(productPayload);
      return res.status(201).json({ message: 'Product added successfully 🎉', product: productPayload });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding product ❌', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const { name, description, brand, gender, category, variants, collection, productDetails, material, fit, gsm } = req.body;

    let updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (brand !== undefined) updateData.brand = brand;
    if (gender !== undefined) updateData.gender = gender;
    if (material !== undefined) updateData.material = material;
    if (fit !== undefined) updateData.fit = fit;
    if (gsm !== undefined) updateData.gsm = gsm;
    
    if (category !== undefined) {
      updateData.category = parseArrayField(category);
    }
    
    if (collection !== undefined) {
      updateData.collection = parseArrayField(collection);
    }
    if (productDetails !== undefined) {
      const parsed = typeof productDetails === 'string' ? JSON.parse(productDetails) : productDetails;
      updateData.productDetails = {
        ...parsed,
        material: material !== undefined ? material : parsed?.material,
        fit: fit !== undefined ? fit : parsed?.fit,
        gsm: gsm !== undefined ? gsm : parsed?.gsm,
      };
    }

    if (variants) {
      updateData.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;

      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (file.fieldname && file.fieldname.startsWith('variantImage_')) {
            const index = parseInt(file.fieldname.split('_')[1]);
            if (updateData.variants[index]) {
              if (!updateData.variants[index].images) updateData.variants[index].images = [];
              updateData.variants[index].images.push(file.secure_url || file.path || file.url);
            }
          }
        });
      }
    }

    // Update in DB if available
    let updatedProduct = null;
    try {
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true, returnDocument: 'after' }
      );
    } catch (dbErr) {
      // ignore db error
    }

    // Update in-memory copy
    const memIndex = inMemoryProducts.findIndex(p => p._id === productId || String(p._id) === String(productId));
    if (memIndex > -1) {
      inMemoryProducts[memIndex] = {
        ...inMemoryProducts[memIndex],
        ...updateData,
      };
      if (!updatedProduct) updatedProduct = inMemoryProducts[memIndex];
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found ❌' });
    }

    res.json({ message: 'Product updated successfully 🎉', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product ❌', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    try {
      await Product.findByIdAndDelete(productId);
    } catch (dbErr) {
      // ignore
    }

    const initialLen = inMemoryProducts.length;
    inMemoryProducts = inMemoryProducts.filter(p => p._id !== productId && String(p._id) !== String(productId));

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
