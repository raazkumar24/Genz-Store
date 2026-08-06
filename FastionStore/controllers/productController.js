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
    const { name, description, category, variants, collection, productDetails } = req.body;

    try {
        let parsedVariants = variants;
        if (typeof variants === 'string') {
            parsedVariants = JSON.parse(variants);
        }

        let parsedProductDetails = productDetails;
        if (typeof productDetails === 'string') {
            parsedProductDetails = JSON.parse(productDetails);
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
            category: category || 'Uncategorized',
            variants: parsedVariants,
            collection: collection || '',
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

        const { name, description, category, variants, collection, productDetails } = req.body;

        let updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (collection !== undefined) updateData.collection = collection;
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