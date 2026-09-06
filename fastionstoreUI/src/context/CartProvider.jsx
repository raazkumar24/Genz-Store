import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { useToast } from "./ToastContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("genz_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("genz_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (product, variantOrQuantity = 1, maybeQty = 1, maybeSize = null, maybeColor = null) => {
    if (!product) return;

    let variant = null;
    let quantity = 1;
    let size = "";
    let color = "";

    // Support both signatures:
    // 1. addToCart(product, activeVariant, quantity, size, color)
    // 2. addToCart(product, quantity, size)
    if (variantOrQuantity && typeof variantOrQuantity === "object") {
      variant = variantOrQuantity;
      quantity = typeof maybeQty === "number" ? maybeQty : 1;
      size = maybeSize || (variant.size ? variant.size.split(",")[0].trim() : "");
      color = maybeColor || variant.color || "";
    } else {
      quantity = typeof variantOrQuantity === "number" ? variantOrQuantity : 1;
      size = typeof maybeQty === "string" ? maybeQty : "";
      variant = product.variants?.[0] || null;
      color = variant?.color || "";
    }

    const productId = product._id;
    const variantId = variant?._id || "";
    const name = product.name;
    const image = variant?.images?.[0] || product.images?.[0] || "";
    const isSale = variant?.isSale || false;
    const price = isSale && variant?.salePrice ? variant.salePrice : (variant?.price || product.price || 0);
    const maxStock = variant?.stock ?? product.stock ?? 99;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.variantId === variantId && item.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = maxStock ? Math.min(newQty, maxStock) : newQty;
        return updated;
      }

      const newItem = {
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
        product,
      };

      return [...prev, newItem];
    });

    addToast(`Added "${name.slice(0, 25)}..." to Cart!`, "success");
  };

  const removeFromCart = (productId, variantId = null, size = null) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        const matchProduct = item.productId === productId || item._id === productId;
        if (!matchProduct) return true;
        if (variantId && item.variantId && item.variantId !== variantId) return true;
        if (size && item.size && item.size !== size) return true;
        return false;
      })
    );
    addToast("Removed from Cart", "info");
  };

  const updateQuantity = (productId, variantId, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variantId, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        const matchProduct = item.productId === productId || item._id === productId;
        const matchVariant = !variantId || item.variantId === variantId;
        const matchSize = !size || item.size === size;

        if (matchProduct && matchVariant && matchSize) {
          const validQty = item.maxStock ? Math.min(newQuantity, item.maxStock) : newQuantity;
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (productId, variantId = null) => {
    return cartItems.some((item) => {
      const matchProduct = item.productId === productId || item._id === productId;
      if (!matchProduct) return false;
      if (variantId && item.variantId && item.variantId !== variantId) return false;
      return true;
    });
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartItems,
        cartCount,
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