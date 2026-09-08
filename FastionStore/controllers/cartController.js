import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

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

// Helper to find or merge all carts for a user (handles String vs ObjectId user format)
const getUserCart = async (userId) => {
  if (!userId || userId === 'guest_user') return null;

  const isMongoId = mongoose.Types.ObjectId.isValid(userId);
  const query = isMongoId
    ? { $or: [{ user: userId }, { user: new mongoose.Types.ObjectId(userId) }] }
    : { user: userId };

  const carts = await Cart.find(query);
  if (!carts || carts.length === 0) return null;

  if (carts.length === 1) return carts[0];

  // Merge multiple duplicate cart documents into the first one
  const primaryCart = carts[0];
  for (let i = 1; i < carts.length; i++) {
    const extraCart = carts[i];
    for (const extraItem of extraCart.items) {
      const exists = primaryCart.items.find(pi =>
        String(pi.productId) === String(extraItem.productId) &&
        String(pi.variantId || '') === String(extraItem.variantId || '') &&
        String(pi.size || '').toLowerCase() === String(extraItem.size || '').toLowerCase()
      );
      if (exists) {
        exists.quantity = Math.max(exists.quantity, extraItem.quantity);
        if (!exists.image && extraItem.image) exists.image = extraItem.image;
        if (!exists.price && extraItem.price) exists.price = extraItem.price;
        if ((!exists.name || exists.name === "Streetwear Drop") && extraItem.name) exists.name = extraItem.name;
      } else {
        primaryCart.items.push(extraItem);
      }
    }
    await Cart.findByIdAndDelete(extraCart._id).catch(err =>
      console.warn("Failed to delete duplicate cart:", err.message)
    );
  }
  await primaryCart.save();
  return primaryCart;
};

// Helper to enrich a cart item with real product details from DB
const enrichCartItem = (item, productDoc = null) => {
  const prod = productDoc || item.product || {};
  let matchedVariant = null;

  if (Array.isArray(prod.variants) && prod.variants.length > 0) {
    const cleanVarId = String(item.variantId || "").trim();
    if (cleanVarId) {
      matchedVariant = prod.variants.find(v => String(v._id) === cleanVarId);
    }
    if (!matchedVariant && item.size) {
      matchedVariant = prod.variants.find(v =>
        String(v.size || "").toLowerCase().trim() === String(item.size).toLowerCase().trim()
      );
    }
    if (!matchedVariant) {
      matchedVariant = prod.variants[0];
    }
  }

  const variantImg = matchedVariant?.images?.[0] || "";
  const variantPrice = matchedVariant
    ? (matchedVariant.isSale && matchedVariant.salePrice ? matchedVariant.salePrice : matchedVariant.price)
    : 0;
  const variantStock = matchedVariant?.stock;

  const finalName = (item.name && item.name !== "Streetwear Drop")
    ? item.name
    : (prod.name || item.name || "Streetwear Drop");

  const finalImage = (item.image && item.image.trim() !== "")
    ? item.image
    : (variantImg || (Array.isArray(prod.images) ? prod.images[0] : "") || "");

  const finalPrice = (Number(item.price) > 0)
    ? Number(item.price)
    : (Number(variantPrice) || Number(prod.price) || 0);

  const finalMaxStock = (Number(item.maxStock) > 0 && Number(item.maxStock) !== 99)
    ? Number(item.maxStock)
    : (Number(variantStock) || Number(prod.stock) || 99);

  return {
    _id: String(item.productId || prod._id || item._id),
    productId: String(item.productId || prod._id || ""),
    variantId: String(item.variantId || matchedVariant?._id || ""),
    name: finalName,
    image: finalImage,
    price: finalPrice,
    quantity: Math.max(1, Number(item.quantity) || 1),
    size: String(item.size || matchedVariant?.size || ""),
    color: String(item.color || matchedVariant?.color || ""),
    maxStock: finalMaxStock,
    product: prod._id ? prod._id : (mongoose.Types.ObjectId.isValid(String(item.productId)) ? item.productId : undefined)
  };
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

    // Auto-enrich item data from Product in DB if frontend didn't pass name/image/price
    let finalName = (name && name !== "Streetwear Drop") ? name : "";
    let finalImage = (image && image.trim() !== "") ? image : "";
    let finalPrice = Number(price) || 0;
    let finalMaxStock = Number(maxStock) || 0;

    if (isMongoId && (!finalImage || !finalPrice || !finalName)) {
      try {
        const prod = await Product.findById(cleanProductId).lean();
        if (prod) {
          if (!finalName) finalName = prod.name;
          const v = prod.variants?.find(v => String(v._id) === cleanVariantId) || prod.variants?.[0];
          if (v) {
            if (!finalImage) finalImage = v.images?.[0] || "";
            if (!finalPrice) finalPrice = v.isSale && v.salePrice ? v.salePrice : v.price;
            if (!finalMaxStock) finalMaxStock = v.stock;
          }
        }
      } catch (e) {
        console.warn("Product lookup failed in addToCart:", e.message);
      }
    }

    finalName = finalName || "Streetwear Drop";
    finalPrice = Math.max(0, finalPrice);
    finalMaxStock = Math.max(1, finalMaxStock || 99);

    const itemPayload = {
      product: isMongoId ? cleanProductId : undefined,
      productId: cleanProductId,
      variantId: cleanVariantId,
      name: finalName,
      image: finalImage,
      price: finalPrice,
      color: cleanColor,
      size: cleanSize,
      quantity: qty,
      maxStock: finalMaxStock
    };

    try {
      let cart = await getUserCart(userId);

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
          if (finalPrice > 0) cart.items[itemIndex].price = finalPrice;
          if (finalImage) cart.items[itemIndex].image = finalImage;
          if (finalName && finalName !== "Streetwear Drop") cart.items[itemIndex].name = finalName;
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
      const cart = await getUserCart(userId);

      if (cart && cart.items && cart.items.length > 0) {
        // Collect product IDs to batch-fetch full product & variant data
        const productIds = cart.items
          .map(item => item.product?._id || item.product || item.productId)
          .filter(id => id && mongoose.Types.ObjectId.isValid(String(id)));

        let productMap = new Map();
        if (productIds.length > 0) {
          const products = await Product.find({ _id: { $in: productIds } }).lean();
          products.forEach(p => productMap.set(String(p._id), p));
        }

        let needsSave = false;
        const formattedItems = cart.items.map(item => {
          const prodKey = String(item.product?._id || item.product || item.productId);
          const prodDoc = productMap.get(prodKey) || null;
          const enriched = enrichCartItem(item, prodDoc);

          // Update MongoDB item if image, price or name was missing
          if (!item.image && enriched.image) {
            item.image = enriched.image;
            needsSave = true;
          }
          if ((!item.price || item.price === 0) && enriched.price > 0) {
            item.price = enriched.price;
            needsSave = true;
          }
          if ((!item.name || item.name === "Streetwear Drop") && enriched.name !== "Streetwear Drop") {
            item.name = enriched.name;
            needsSave = true;
          }
          if (!item.product && enriched.product) {
            item.product = enriched.product;
            needsSave = true;
          }

          return enriched;
        });

        if (needsSave) {
          cart.save().catch(e => console.warn("Background cart enrichment save failed:", e.message));
        }

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
      const cart = await getUserCart(userId);
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
      const cart = await getUserCart(userId);
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
      let cart = await getUserCart(userId);
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
      let cart = await getUserCart(userId);
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      // Collect product IDs to batch-fetch details
      const missingProdIds = items
        .map(i => String(i.productId || i._id || i.product || '').trim())
        .filter(id => id && mongoose.Types.ObjectId.isValid(id));

      let productMap = new Map();
      if (missingProdIds.length > 0) {
        const prods = await Product.find({ _id: { $in: missingProdIds } }).lean();
        prods.forEach(p => productMap.set(String(p._id), p));
      }

      for (const item of items) {
        const productId = String(item.productId || item._id || item.product || "").trim();
        if (!productId) continue;

        const isMongoId = mongoose.Types.ObjectId.isValid(productId);
        const prodDoc = productMap.get(productId);
        const enriched = enrichCartItem(item, prodDoc);

        const variantId = enriched.variantId;
        const size = enriched.size;
        const color = enriched.color;

        const existingIdx = cart.items.findIndex(ci =>
          String(ci.productId) === productId &&
          String(ci.variantId || "") === variantId &&
          String(ci.size || "").toLowerCase() === size.toLowerCase() &&
          String(ci.color || "").toLowerCase() === color.toLowerCase()
        );

        if (existingIdx > -1) {
          cart.items[existingIdx].quantity = Math.max(cart.items[existingIdx].quantity, item.quantity || 1);
          if (enriched.image) cart.items[existingIdx].image = enriched.image;
          if (enriched.price > 0) cart.items[existingIdx].price = enriched.price;
          if (enriched.name !== "Streetwear Drop") cart.items[existingIdx].name = enriched.name;
        } else {
          cart.items.push({
            product: isMongoId ? productId : undefined,
            productId,
            variantId,
            name: enriched.name,
            image: enriched.image,
            price: enriched.price,
            color,
            size,
            quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
            maxStock: enriched.maxStock
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
