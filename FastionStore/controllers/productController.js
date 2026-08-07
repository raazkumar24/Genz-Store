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

// 👑 1. Add Product Controller (Fixed 🛠️)
export const addProduct = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty or not parsed. Form-data check karein." });
    }
    const { name, description, brand, category, variants, collection, productDetails } = req.body;

    try {
        let parsedVariants = variants;
        if (typeof variants === 'string') {
            parsedVariants = JSON.parse(variants);
        }

        let parsedProductDetails = productDetails;
        if (typeof productDetails === 'string') {
            parsedProductDetails = JSON.parse(productDetails);
        }

        let parsedCategory = category || ['Uncategorized'];
        if (typeof category === 'string') {
            try {
                parsedCategory = JSON.parse(category);
            } catch (e) {
                // If it fails to parse, it might be a simple string. Just wrap it in an array.
                parsedCategory = [category];
            }
        }

        let parsedCollection = collection || [];
        if (typeof collection === 'string') {
            try {
                parsedCollection = JSON.parse(collection);
            } catch (e) {
                parsedCollection = [collection];
            }
        }

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

        const { name, description, brand, category, variants, collection, productDetails } = req.body;

        let updateData = {};
        console.log("UPDATE REQ BODY CATEGORY:", category);
        console.log("UPDATE REQ BODY COLLECTION:", collection);
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (brand !== undefined) updateData.brand = brand;
        
        if (category !== undefined) {
            if (typeof category === 'string') {
                try {
                    updateData.category = JSON.parse(category);
                } catch (e) {
                    updateData.category = [category];
                }
            } else {
                updateData.category = category;
            }
        }
        
        if (collection !== undefined) {
            if (typeof collection === 'string') {
                try {
                    updateData.collection = JSON.parse(collection);
                } catch (e) {
                    updateData.collection = [collection];
                }
            } else {
                updateData.collection = collection;
            }
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