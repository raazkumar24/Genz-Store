import Cart from '../models/Cart.js';

// 1. ADD TO CART
export const addToCart = async (req, res) => {
    try {
        const { productId, variantId, color, size, quantity } = req.body;
        const userId = req.user.id;

        // Validation: Quantity hamesha 1 ya usse zyada honi chahiye
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity kam se kam 1 honi chahiye! 🛒" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, variantId, color, size, quantity }]
            });
            return res.status(201).json({ message: "Cart ban gayi aur item add ho gaya! 🛒", cart });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            (item.variantId ? item.variantId.toString() === variantId : item.color === color) && 
            item.size === size
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, variantId, color, size, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Cart update ho gayi! ✅", cart });

    } catch (error) {
        res.status(500).json({ message: "Cart me item add karne me dikkat aayi ❌", error: error.message });
    }
};

// 2. GET CART
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id; 
        const cart = await Cart.findOne({ user: userId }).populate('items.product'); 
        
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ message: "Aapki cart khali hai! 🛒", items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Cart fetch karne me dikkat aayi ❌", error: error.message });      
    }
};

// 3. UPDATE CART
export const updateCart = async (req, res) => {
    try {
        const { productId, variantId, color, size, quantity } = req.body;
        const userId = req.user.id;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity 1 se kam nahi ho sakti. Item remove karne ke liye delete endpoint use karein! ❌" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart nahi mili! 🛒" });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            (item.variantId ? item.variantId.toString() === variantId : item.color === color) && 
            item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item nahi mili! 🛒" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Cart quantity update ho gayi! ✅", cart });

    } catch (error) {
        res.status(500).json({ message: "Cart me item update karne me dikkat aayi ❌", error: error.message });
    }
};

// 4. REMOVE FROM CART
export const removeFromCart = async (req, res) => {
    try {
        const { productId, variantId, color, size } = req.body;
        const userId = req.user.id; 

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart nahi mili! 🛒" });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            (item.variantId ? item.variantId.toString() === variantId : item.color === color) && 
            item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item nahi mili! 🛒" });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json({ message: "Item cart se hata diya gaya! ✅", cart });

    } catch (error) {
        res.status(500).json({ message: "Cart me item remove karne me dikkat aayi ❌", error: error.message });
    }
};
