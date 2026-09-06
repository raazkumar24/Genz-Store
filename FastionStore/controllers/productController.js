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

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    if (products && products.length > 0) {
      return res.json(products);
    }
  } catch (error) {
    // Database offline or query error, fall through to inMemoryProducts
  }
  res.json(inMemoryProducts);
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
