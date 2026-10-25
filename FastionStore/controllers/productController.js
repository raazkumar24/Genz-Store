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
const COLOR_HEX_MAP = {
  black: "#111111",
  white: "#FFFFFF",
  gray: "#6B7280",
  grey: "#6B7280",
  beige: "#F5F5DC",
  cream: "#FFFDD0",
  olive: "#4D7C0F",
  green: "#22C55E",
  blue: "#2563EB",
  navy: "#1E3A8A",
  red: "#EF4444",
  crimson: "#DC2626",
  orange: "#F97316",
  yellow: "#EAB308",
  amber: "#F59E0B",
  lime: "#84CC16",
  pink: "#EC4899",
  purple: "#A855F7",
  brown: "#92400E",
  cyan: "#06B6D4",
  teal: "#14B8A6",
};

/**
 * Controller: Get dynamic popular color palette from live products
 * Returns the most frequent colors with hex codes, product counts, and clean labels
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

    // Count product occurrences per color
    const colorCounts = {};
    for (const product of products) {
      if (Array.isArray(product.variants)) {
        const productColors = new Set();
        for (const variant of product.variants) {
          if (variant.color) {
            const cleanColor = String(variant.color).trim().toLowerCase();
            productColors.add(cleanColor);
          }
        }
        for (const color of productColors) {
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      }
    }

    // Format into structured array sorted by count
    const sorted = Object.entries(colorCounts)
      .map(([color, count]) => {
        const name = color.charAt(0).toUpperCase() + color.slice(1);
        const hex = COLOR_HEX_MAP[color] || "#888888";
        return {
          name,
          color,
          filter: color,
          hex,
          count,
        };
      })
      .sort((a, b) => b.count - a.count);

    if (sorted.length === 0) {
      // Curated default streetwear palette fallback
      return res.json([
        { name: "Pitch Black", color: "black", filter: "black", hex: "#111111", count: 12 },
        { name: "Cobalt Blue", color: "blue", filter: "blue", hex: "#2563EB", count: 8 },
        { name: "Sunset Orange", color: "orange", filter: "orange", hex: "#F97316", count: 6 },
        { name: "Acid Lime", color: "lime", filter: "lime", hex: "#84CC16", count: 5 },
        { name: "Signal Crimson", color: "red", filter: "red", hex: "#EF4444", count: 4 },
      ]);
    }

    return res.json(sorted.slice(0, 8));
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

    // 1. Color filter
    if (color && color !== "all") {
      const c = color.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        p.variants && p.variants.some((v) => String(v.color || "").toLowerCase().includes(c))
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
  const { name, description, brand, gender, category, variants, collection, productDetails } = req.body;

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
      category: parsedCategory,
      collection: parsedCollection,
      variants: parsedVariants || [],
      productDetails: parsedProductDetails || undefined,
    };

    try {
      const product = new Product(productPayload);
      await product.save();
      inMemoryProducts.unshift(product.toObject());
      return res.status(201).json({ message: 'Product added successfully 🎉', product });
    } catch (dbErr) {
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
    const { name, description, brand, gender, category, variants, collection, productDetails } = req.body;

    let updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (brand !== undefined) updateData.brand = brand;
    if (gender !== undefined) updateData.gender = gender;
    
    if (category !== undefined) {
      updateData.category = parseArrayField(category);
    }
    
    if (collection !== undefined) {
      updateData.collection = parseArrayField(collection);
    }
    if (productDetails !== undefined) {
      updateData.productDetails = typeof productDetails === 'string' ? JSON.parse(productDetails) : productDetails;
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
        { returnDocument: 'after', runValidators: true }
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
