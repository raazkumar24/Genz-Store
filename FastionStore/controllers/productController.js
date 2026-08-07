import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

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

// 👑 1. Add Product Controller (Fixed 🛠️)
export const addProduct = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty or not parsed. Form-data check karein." });
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

        // 🔑 Map variant specific images
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

        const product = new Product({
            name,
            description: description || '',
            brand: brand || '',
            gender: gender || 'Men',
            category: parsedCategory,
            collection: parsedCollection,
            variants: parsedVariants,
            productDetails: parsedProductDetails || undefined,
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully 🎉', product });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product ❌', error: error.message });
    }
};

// 👑 2. Update Product Controller (Fixed 🛠️)
export const updateProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found ❌' });
        }

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

            // 🔑 Map variant specific images
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

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        );

        res.json({ message: 'Product updated successfully 🎉', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product ❌', error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};