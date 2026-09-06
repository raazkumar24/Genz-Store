import Cart from '../models/Cart.js';

// In-memory cart store per user
const inMemoryCarts = new Map();

// 1. ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, color, size, quantity } = req.body;
    const userId = req.user?.id || 'guest_user';

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1! 🛒" });
    }

    try {
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = await Cart.create({
          user: userId,
          items: [{ product: productId, variantId, color, size, quantity }]
        });
        return res.status(201).json({ message: "Cart created and item added! 🛒", cart });
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
      return res.status(200).json({ message: "Cart updated! ✅", cart });
    } catch (dbErr) {
      // In-memory fallback
      let userCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
      const itemIndex = userCart.items.findIndex(item =>
        item.product === productId &&
        item.variantId === variantId &&
        item.size === size
      );

      if (itemIndex > -1) {
        userCart.items[itemIndex].quantity += quantity;
      } else {
        userCart.items.push({ product: productId, variantId, color, size, quantity });
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
    const userId = req.user?.id || 'guest_user'; 
    try {
      const cart = await Cart.findOne({ user: userId }).populate('items.product'); 
      if (cart && cart.items.length > 0) {
        return res.status(200).json(cart);
      }
    } catch (dbErr) {
      // DB offline
    }

    const memCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
    return res.status(200).json(memCart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart ❌", error: error.message });      
  }
};

// 3. UPDATE CART
export const updateCart = async (req, res) => {
  try {
    const { productId, variantId, color, size, quantity } = req.body;
    const userId = req.user?.id || 'guest_user';

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1. ❌" });
    }

    try {
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        const itemIndex = cart.items.findIndex(item => 
          item.product.toString() === productId && 
          (item.variantId ? item.variantId.toString() === variantId : item.color === color) && 
          item.size === size
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
          await cart.save();
          return res.status(200).json({ message: "Cart quantity updated! ✅", cart });
        }
      }
    } catch (dbErr) {
      // DB offline
    }

    const userCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
    const itemIndex = userCart.items.findIndex(item =>
      item.product === productId &&
      item.variantId === variantId &&
      item.size === size
    );

    if (itemIndex > -1) {
      userCart.items[itemIndex].quantity = quantity;
      inMemoryCarts.set(userId, userCart);
      return res.status(200).json({ message: "Cart quantity updated! ✅", cart: userCart });
    }

    res.status(404).json({ message: "Item not found in cart! 🛒" });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart ❌", error: error.message });
  }
};

// 4. REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId, color, size } = req.body;
    const userId = req.user?.id || 'guest_user'; 

    try {
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        const itemIndex = cart.items.findIndex(item => 
          item.product.toString() === productId && 
          (item.variantId ? item.variantId.toString() === variantId : item.color === color) && 
          item.size === size
        );

        if (itemIndex > -1) {
          cart.items.splice(itemIndex, 1);
          await cart.save();
          return res.status(200).json({ message: "Item removed from cart! ✅", cart });
        }
      }
    } catch (dbErr) {
      // DB offline
    }

    const userCart = inMemoryCarts.get(userId) || { user: userId, items: [] };
    const itemIndex = userCart.items.findIndex(item =>
      item.product === productId &&
      item.variantId === variantId &&
      item.size === size
    );

    if (itemIndex > -1) {
      userCart.items.splice(itemIndex, 1);
      inMemoryCarts.set(userId, userCart);
      return res.status(200).json({ message: "Item removed from cart! ✅", cart: userCart });
    }

    res.status(404).json({ message: "Item not found in cart! 🛒" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart ❌", error: error.message });
  }
};
