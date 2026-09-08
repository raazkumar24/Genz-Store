import React, { useState, useEffect, useCallback, useRef } from "react";
import { CartContext } from "./CartContext";
import { useToast } from "./ToastContext";
import {
  addToCartAPI,
  updateCartAPI,
  removeFromCartAPI,
  fetchCartAPI,
  syncCartAPI,
  getGuestId,
} from "../services/cartService";

const normalizeCartItem = (item) => {
  if (!item || typeof item !== "object") return null;

  const productId = String(item.productId || item._id || item.id || "").trim();
  if (!productId) return null;

  const variantId = String(item.variantId || "").trim();
  const name = item.name || "Streetwear Drop";
  const image =
    item.image ||
    (Array.isArray(item.images) ? item.images[0] : "") ||
    item.product?.images?.[0] ||
    "";
  const price = Math.max(0, Number(item.price) || 0);
  const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
  const size = String(item.size || item.selectedSize || "").trim();
  const color = String(item.color || item.selectedColor || "").trim();
  const maxStock = Math.max(1, Number(item.maxStock) || 99);

  return {
    _id: productId, // backwards compatibility
    productId,
    variantId,
    name,
    image,
    price,
    quantity,
    size,
    color,
    maxStock,
  };
};

const loadSavedCart = () => {
  try {
    const saved =
      localStorage.getItem("genz_cart") ||
      localStorage.getItem("fashionstore_cart");
    if (!saved) return [];

    let parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      if (parsed && Array.isArray(parsed.items)) {
        parsed = parsed.items;
      } else if (parsed && Array.isArray(parsed.cart)) {
        parsed = parsed.cart;
      } else {
        return [];
      }
    }

    return parsed.map(normalizeCartItem).filter(Boolean);
  } catch (e) {
    console.error("Failed to load cart from localStorage", e);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadSavedCart);
  const { addToast } = useToast();

  // Track if backend sync is in-flight to avoid double calls
  const syncTimeout = useRef(null);

  // ─── Save to localStorage whenever cartItems changes ───────────────────────
  useEffect(() => {
    try {
      localStorage.setItem("genz_cart", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartChange"));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  // ─── On mount: fetch from backend and merge ─────────────────────────────────
  useEffect(() => {
    const syncFromBackend = async () => {
      try {
        const userId = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))?.id
          : getGuestId();

        const data = await fetchCartAPI(userId);
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const backendItems = data.items.map(normalizeCartItem).filter(Boolean);
          // Merge backend items with local items (backend wins on duplicates)
          setCartItems((prev) => {
            const merged = [...backendItems];
            prev.forEach((localItem) => {
              const localProdId = String(localItem.productId || localItem._id || "").trim();
              const exists = merged.some(
                (bi) => String(bi.productId || bi._id || "").trim() === localProdId &&
                  String(bi.variantId || "") === String(localItem.variantId || "") &&
                  String(bi.size || "").toLowerCase() === String(localItem.size || "").toLowerCase() &&
                  String(bi.color || "").toLowerCase() === String(localItem.color || "").toLowerCase()
              );
              if (!exists) merged.push(localItem);
            });
            return merged;
          });
        }
      } catch (e) {
        // Backend offline — just use localStorage
        console.warn("Backend cart fetch failed, using localStorage.", e.message);
      }
    };

    syncFromBackend();
  }, []);

  // ─── Sync across tabs / windows ─────────────────────────────────────────────
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "genz_cart" || e.key === "fashionstore_cart") {
        setCartItems(loadSavedCart());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ─── Debounced backend sync ──────────────────────────────────────────────────
  const debouncedSync = useCallback((items) => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      try {
        await syncCartAPI(items);
      } catch (e) {
        // silent — localStorage already saved
      }
    }, 800);
  }, []);

  // ─── addToCart ───────────────────────────────────────────────────────────────
  const addToCart = (
    product,
    variantOrQuantity = 1,
    maybeQty = 1,
    maybeSize = null,
    maybeColor = null
  ) => {
    if (!product) return;

    let variant = null;
    let quantity = 1;
    let size = "";
    let color = "";

    if (variantOrQuantity && typeof variantOrQuantity === "object") {
      variant = variantOrQuantity;
      quantity = typeof maybeQty === "number" ? Math.max(1, maybeQty) : 1;
      size = maybeSize || (variant.size ? variant.size.split(",")[0].trim() : "");
      color = maybeColor || variant.color || "";
    } else {
      quantity = typeof variantOrQuantity === "number" ? Math.max(1, variantOrQuantity) : 1;
      size = typeof maybeQty === "string" ? maybeQty : "";
      variant = product.variants?.[0] || null;
      color = variant?.color || "";
    }

    const productId = String(product._id || product.id || "").trim();
    if (!productId) return;

    const variantId = String(variant?._id || "").trim();
    const name = product.name || "Streetwear Drop";
    const image = variant?.images?.[0] || product.images?.[0] || "";
    const isSale = variant?.isSale || false;
    const price =
      isSale && variant?.salePrice
        ? Number(variant.salePrice)
        : Number(variant?.price || product.price || 0);
    const maxStock = Number(variant?.stock ?? product.stock ?? 99);

    const normSize = String(size || "").trim().toLowerCase();
    const normColor = String(color || "").trim().toLowerCase();

    let updatedItems;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => {
        const itemProdId = String(item.productId || item._id || "").trim();
        const itemVarId = String(item.variantId || "").trim();
        const itemSize = String(item.size || "").trim().toLowerCase();
        const itemColor = String(item.color || "").trim().toLowerCase();

        return (
          itemProdId === productId &&
          itemVarId === variantId &&
          itemSize === normSize &&
          itemColor === normColor
        );
      });

      let next;
      if (existingIndex > -1) {
        next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: maxStock ? Math.min(newQty, maxStock) : newQty,
          price: price || next[existingIndex].price,
          image: image || next[existingIndex].image,
        };
      } else {
        const newItem = {
          _id: productId,
          productId,
          variantId,
          name,
          image,
          price,
          quantity,
          size,
          color,
          maxStock,
        };
        next = [...prev, newItem];
      }

      updatedItems = next;
      return next;
    });

    addToast(`"${name.slice(0, 28)}" cart mein add hua! 🛒`, "success");

    // Async backend save — fire and forget with debounce
    setTimeout(() => {
      addToCartAPI({
        productId,
        variantId,
        name,
        image,
        price,
        color,
        size,
        quantity,
        maxStock,
      }).catch(() => {});
    }, 0);
  };

  // ─── removeFromCart ──────────────────────────────────────────────────────────
  const removeFromCart = (productId, variantId = null, size = null, color = null) => {
    if (!productId) return;
    const prodIdStr = String(productId).trim();
    const targetSize = size ? String(size).trim().toLowerCase() : null;
    const targetVariant = variantId ? String(variantId).trim() : null;
    const targetColor = color ? String(color).trim().toLowerCase() : null;

    setCartItems((prev) => {
      const next = prev.filter((item) => {
        const itemProdId = String(item.productId || item._id || "").trim();
        if (itemProdId !== prodIdStr) return true;

        if (targetVariant && item.variantId) {
          if (String(item.variantId).trim() !== targetVariant) return true;
        }

        if (targetSize && item.size) {
          if (String(item.size).trim().toLowerCase() !== targetSize) return true;
        }

        if (targetColor && item.color) {
          if (String(item.color).trim().toLowerCase() !== targetColor) return true;
        }

        return false;
      });
      return next;
    });

    addToast("Cart se remove ho gaya", "info");

    // Backend remove
    removeFromCartAPI({ productId: prodIdStr, variantId, size, color }).catch(() => {});
  };

  // ─── updateQuantity ──────────────────────────────────────────────────────────
  const updateQuantity = (productId, variantId, size, newQuantity, color = null) => {
    const nextQty = parseInt(newQuantity, 10);
    if (isNaN(nextQty) || nextQty <= 0) {
      removeFromCart(productId, variantId, size, color);
      return;
    }

    const prodIdStr = String(productId || "").trim();
    const targetSize = size ? String(size).trim().toLowerCase() : null;
    const targetVariant = variantId ? String(variantId).trim() : null;

    let itemColor = color;
    let itemPrice = 0;

    setCartItems((prev) =>
      prev.map((item) => {
        const itemProdId = String(item.productId || item._id || "").trim();
        const matchProduct = itemProdId === prodIdStr;
        const matchVariant =
          !targetVariant || !item.variantId || String(item.variantId).trim() === targetVariant;
        const matchSize =
          !targetSize || !item.size || String(item.size).trim().toLowerCase() === targetSize;

        if (matchProduct && matchVariant && matchSize) {
          const maxStock = Number(item.maxStock) || 99;
          const validQty = Math.min(nextQty, maxStock);
          itemColor = item.color;
          itemPrice = item.price;
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );

    // Backend update (debounced)
    setTimeout(() => {
      updateCartAPI({
        productId: prodIdStr,
        variantId,
        size,
        color: itemColor,
        quantity: nextQty,
      }).catch(() => {});
    }, 500);
  };

  // ─── clearCart ───────────────────────────────────────────────────────────────
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem("genz_cart");
      localStorage.removeItem("fashionstore_cart");
    } catch (e) {
      console.error(e);
    }
  };

  // ─── isInCart ────────────────────────────────────────────────────────────────
  const isInCart = (productId, variantId = null) => {
    if (!productId) return false;
    const prodIdStr = String(productId).trim();
    const varIdStr = variantId ? String(variantId).trim() : null;

    return cartItems.some((item) => {
      const itemProdId = String(item.productId || item._id || "").trim();
      if (itemProdId !== prodIdStr) return false;
      if (varIdStr && item.variantId && String(item.variantId).trim() !== varIdStr) {
        return false;
      }
      return true;
    });
  };

  // ─── Computed values ─────────────────────────────────────────────────────────

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  // ✅ cartCount = number of UNIQUE items (not sum of quantities)
  const cartCount = cartItems.length;

  // Total quantity (for order summary text like "3 items in bag")
  const cartQuantity = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartItems,
        cartCount,
        cartQuantity,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};