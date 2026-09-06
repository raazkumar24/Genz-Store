import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { useToast } from "./ToastContext";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
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
      localStorage.setItem("genz_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item._id === product._id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { ...product, quantity, selectedSize }];
    });
    addToast("Added to Cart!", "success");
  };

  const removeFromCart = (productId, selectedSize = null) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item._id === productId && item.selectedSize === selectedSize)
      )
    );
    addToast("Removed from Cart", "info");
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};