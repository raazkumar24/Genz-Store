import mongoose from 'mongoose';
import Cart from '../models/Cart.js';

// In-memory cart fallback if MongoDB is unreachable
const inMemoryCarts = new Map();

// Helper to extract a reliable user identifier
const getUserId = (req) => {
  return String(
    req.user?.id ||
    req.user?._id ||
    req.headers['x-guest-id'] ||
    req.body?.userId ||
    req.query?.userId ||
    'guest_user'
  ).trim();
};

// 1. ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, color, size, quantity, name, image, price, maxStock } = req.body;
    const userId = getUserId(req);

    const cleanProductId = String(productId || '').trim();
    if (!cleanProductId) {
      return res.status(400).json({ message: "Product ID is required! 🛒" });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const cleanVariantId = String(variantId || '').trim();
    const cleanColor = String(color || '').trim();
    const cleanSize = String(size || '').trim();
    const isMongoId = mongoose.Types.ObjectId.isValid(cleanProductId);

    const itemPayload = {
      product: isMongoId ? cleanProductId : undefined,
      productId: cleanProductId,
      variantId: cleanVariantId,
      name: name || "Streetwear Drop",
      image: image || "",
      price: Math.max(0, Number(price) || 0),
      color: cleanColor,
      size: cleanSize,
      quantity: qty,
      maxStock: Math.max(1, Number(maxStock) || 99)
    };

    try {
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [itemPayload]
        });
      } else {
        const itemIndex = cart.items.findIndex(item =>
          String(item.productId) === cleanProductId &&
          String(item.variantId || '') === cleanVariantId &&
          String(item.size || '').toLowerCase() === cleanSize.toLowerCase() &&
          String(item.color || '').toLowerCase() === cleanColor.toLowerCase()
        );

        if (itemIndex > -1) {
          const updatedQty = cart.items[itemIndex].quantity + qty;
          const limitStock = Number(cart.items[itemIndex].maxStock) || itemPayload.maxStock;
          cart.items[itemIndex].quantity = limitStock ? Math.min(updatedQty, limitStock) : updatedQty;
          if (itemPayload.price) cart.items[itemIndex].price = itemPayload.price;
          if (itemPayload.image) cart.items[itemIndex].image = itemPayload.image;
          if (itemPayload.name) cart.items[itemIndex].name = itemPayload.name;
        } else {
          cart.items.push(itemPayload);
        }
      }

      await cart.save();
      return res.status(200).json({ message: "Cart updated! ✅", cart });
    } catch (dbErr) {
      console.warn("MongoDB addToCart fallback:", dbErr.message);

      let userCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
      const itemIndex = userCart.items.findIndex(item =>
        String(item.productId) === cleanProductId &&
        String(item.variantId || '') === cleanVariantId &&
        String(item.size || '').toLowerCase() === cleanSize.toLowerCase() &&
        String(item.color || '').toLowerCase() === cleanColor.toLowerCase()
      );

      if (itemIndex > -1) {
        userCart.items[itemIndex].quantity += qty;
      } else {
        userCart.items.push(itemPayload);
      }

      inMemoryCarts.set(userId, userCart);
      return res.status(200).json({ message: "Cart updated! ✅", cart: userCart });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart ❌", error: error.message });
  }
};

// 2. GET CART
export const getCart = async (req, res) => {
  try {
    const userId = String(req.params.userId || getUserId(req)).trim();

    try {
      const cart = await Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name price images variants stock isSale salePrice'
      }).lean();

      if (cart) {
        const formattedItems = cart.items.map(item => {
          const prod = item.product || {};
          const fallbackImg = Array.isArray(prod.images) ? prod.images[0] : "";
          return {
            _id: String(item.productId || prod._id || item._id),
            productId: String(item.productId || prod._id || ""),
            variantId: String(item.variantId || ""),
            name: item.name || prod.name || "Streetwear Drop",
            image: item.image || fallbackImg || "",
            price: Number(item.price) || Number(prod.price) || 0,
            quantity: Number(item.quantity) || 1,
            size: String(item.size || ""),
            color: String(item.color || ""),
            maxStock: Number(item.maxStock) || Number(prod.stock) || 99
          };
        });

        return res.status(200).json({ user: userId, items: formattedItems });
      }

      return res.status(200).json({ user: userId, items: [] });
    } catch (dbErr) {
      console.warn("MongoDB getCart fallback:", dbErr.message);
      const memCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
      return res.status(200).json(memCart);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart ❌", error: error.message });
  }
};

// 3. UPDATE CART
export const updateCart = async (req, res) => {
  try {
    const { productId, variantId, color, size, quantity } = req.body;
    const userId = getUserId(req);
    const newQty = parseInt(quantity, 10);

    if (isNaN(newQty) || newQty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1. ❌" });
    }

    const cleanProductId = String(productId || '').trim();
    const cleanVariantId = String(variantId || '').trim();
    const cleanSize = String(size || '').trim().toLowerCase();
    const cleanColor = String(color || '').trim().toLowerCase();

    try {
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        const itemIndex = cart.items.findIndex(item => {
          const matchProd = String(item.productId) === cleanProductId;
          const matchVar = !cleanVariantId || String(item.variantId || '') === cleanVariantId;
          const matchSize = !cleanSize || String(item.size || '').toLowerCase() === cleanSize;
          const matchColor = !cleanColor || String(item.color || '').toLowerCase() === cleanColor;
          return matchProd && matchVar && matchSize && matchColor;
        });

        if (itemIndex > -1) {
          const max = Number(cart.items[itemIndex].maxStock) || 99;
          cart.items[itemIndex].quantity = Math.min(newQty, max);
          await cart.save();
          return res.status(200).json({ message: "Cart quantity updated! ✅", cart });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB updateCart fallback:", dbErr.message);
    }

    const userCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
    const itemIndex = userCart.items.findIndex(item =>
      String(item.productId) === cleanProductId &&
      (!cleanVariantId || String(item.variantId || '') === cleanVariantId) &&
      (!cleanSize || String(item.size || '').toLowerCase() === cleanSize)
    );

    if (itemIndex > -1) {
      userCart.items[itemIndex].quantity = newQty;
      inMemoryCarts.set(userId, userCart);
      return res.status(200).json({ message: "Cart quantity updated! ✅", cart: userCart });
    }

    return res.status(404).json({ message: "Item not found in cart! 🛒" });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart ❌", error: error.message });
  }
};

// 4. REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId, size, color } = req.body;
    const userId = getUserId(req);

    const cleanProductId = String(productId || '').trim();
    const cleanVariantId = String(variantId || '').trim();
    const cleanSize = String(size || '').trim().toLowerCase();
    const cleanColor = String(color || '').trim().toLowerCase();

    try {
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        const initialLen = cart.items.length;
        cart.items = cart.items.filter(item => {
          const matchProd = String(item.productId) === cleanProductId;
          const matchVar = !cleanVariantId || String(item.variantId || '') === cleanVariantId;
          const matchSize = !cleanSize || String(item.size || '').toLowerCase() === cleanSize;
          const matchColor = !cleanColor || String(item.color || '').toLowerCase() === cleanColor;
          return !(matchProd && matchVar && matchSize && matchColor);
        });

        if (cart.items.length !== initialLen) {
          await cart.save();
          return res.status(200).json({ message: "Item removed from cart! ✅", cart });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB removeFromCart fallback:", dbErr.message);
    }

    const userCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
    userCart.items = userCart.items.filter(item => {
      const matchProd = String(item.productId) === cleanProductId;
      const matchVar = !cleanVariantId || String(item.variantId || '') === cleanVariantId;
      const matchSize = !cleanSize || String(item.size || '').toLowerCase() === cleanSize;
      return !(matchProd && matchVar && matchSize);
    });
    inMemoryCarts.set(userId, userCart);
    return res.status(200).json({ message: "Item removed from cart! ✅", cart: userCart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart ❌", error: error.message });
  }
};

// 5. CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    try {
      let cart = await Cart.findOne({ user: userId });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    } catch (dbErr) {
      console.warn("MongoDB clearCart fallback:", dbErr.message);
    }
    inMemoryCarts.set(userId, { user: userId, items: [] });
    return res.status(200).json({ message: "Cart cleared! 🛒", cart: { user: userId, items: [] } });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};

// 6. SYNC CART (merges client-side cart items into MongoDB)
export const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = getUserId(req);

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array" });
    }

    try {
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      for (const item of items) {
        const productId = String(item.productId || item._id || item.product || "").trim();
        if (!productId) continue;

        const isMongoId = mongoose.Types.ObjectId.isValid(productId);
        const variantId = String(item.variantId || "").trim();
        const size = String(item.size || "").trim();
        const color = String(item.color || "").trim();

        const existingIdx = cart.items.findIndex(ci =>
          String(ci.productId) === productId &&
          String(ci.variantId || "") === variantId &&
          String(ci.size || "").toLowerCase() === size.toLowerCase() &&
          String(ci.color || "").toLowerCase() === color.toLowerCase()
        );

        if (existingIdx > -1) {
          cart.items[existingIdx].quantity = Math.max(cart.items[existingIdx].quantity, item.quantity || 1);
        } else {
          cart.items.push({
            product: isMongoId ? productId : undefined,
            productId,
            variantId,
            name: item.name || "Streetwear Drop",
            image: item.image || "",
            price: Number(item.price) || 0,
            color,
            size,
            quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
            maxStock: Number(item.maxStock) || 99
          });
        }
      }

      await cart.save();
      return res.status(200).json({ message: "Cart synced successfully! ✅", cart });
    } catch (dbErr) {
      console.warn("MongoDB syncCart fallback:", dbErr.message);
      return res.status(200).json({ message: "Cart synced with fallback", cart: { user: userId, items } });
    }
  } catch (error) {
    res.status(500).json({ message: "Error syncing cart", error: error.message });
  }
};
