import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  addToCartAPI,
  updateCartAPI,
  removeFromCartAPI,
  fetchCartAPI,
  clearCartAPI,
  syncCartAPI,
} from "../services/cartService";
import { useToast } from "./ToastContext";

/**
 * CartContext — localStorage-based cart state management
 *
 * Cart item structure:
 * {
 *   productId: string,
 *   variantId: string,
 *   name: string,
 *   color: string,
 *   size: string,
 *   price: number,
 *   image: string,
 *   quantity: number,
 * }
 */

const CartContext = createContext(null);

const CART_STORAGE_KEY = "fashionstore_cart";

// localStorage se cart load karo
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// cart ko localStorage me save karo
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Cart save failed:", e);
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  // Initial cart load from backend if user is logged in
  useEffect(() => {
    const loadBackendCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const userRaw = localStorage.getItem("user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        const userId = user?.id || user?._id || null;

        const response = await fetchCartAPI(userId);
        if (response && Array.isArray(response.items)) {
          const fetchedItems = response.items
            .map((item) => {
              const product = item.product || {};
              const variant =
                product.variants?.find((v) => String(v._id) === String(item.variantId)) ||
                product.variants?.[0] || {};
              const fallbackImg = variant.images?.[0] || (Array.isArray(product.images) ? product.images[0] : "") || "";
              const fallbackPrice =
                variant.isSale && variant.salePrice
                  ? variant.salePrice
                  : variant.price;

              const cleanImage = (item.image && typeof item.image === "string" && item.image.trim() !== "")
                ? item.image
                : fallbackImg;

              const cleanPrice = Number(item.price) > 0
                ? Number(item.price)
                : (Number(fallbackPrice) || Number(product.price) || 0);

              const cleanName = (item.name && item.name !== "Streetwear Drop")
                ? item.name
                : (product.name || item.name || "Streetwear Drop");

              return {
                productId: String(item.productId || product._id || item._id || ""),
                variantId: String(item.variantId || variant._id || ""),
                name: cleanName,
                color: item.color || variant.color || "",
                size: item.size || variant.size || "",
                price: cleanPrice,
                image: cleanImage,
                quantity: Math.max(1, Number(item.quantity) || 1),
                maxStock: Number(item.maxStock) > 0 ? Number(item.maxStock) : (Number(variant.stock) || 99),
              };
            })
            .filter((item) => item.productId);

          // Merge with any guest items that were stored before login
          const localItems = loadCartFromStorage();
          if (localItems.length > 0) {
            const merged = [...fetchedItems];
            let hasNewLocal = false;

            for (const localItem of localItems) {
              const exists = merged.some(
                (mi) =>
                  mi.productId === localItem.productId &&
                  mi.variantId === localItem.variantId &&
                  String(mi.size).toLowerCase() === String(localItem.size).toLowerCase()
              );
              if (!exists) {
                merged.push(localItem);
                hasNewLocal = true;
              }
            }

            setCartItems(merged);
            saveCartToStorage(merged);

            if (hasNewLocal) {
              syncCartAPI(merged).catch((e) =>
                console.warn("Cart sync after login warning:", e.message)
              );
            }
          } else {
            setCartItems(fetchedItems);
            saveCartToStorage(fetchedItems);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart from backend", error);
      }
    };

    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        loadBackendCart();
      } else {
        // Logged out — clear cart
        setCartItems([]);
        saveCartToStorage([]);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    loadBackendCart();

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // Jab bhi cartItems change ho, storage update karo
  useEffect(() => {
    saveCartToStorage(cartItems);
    // Navbar cart count update ke liye event dispatch
    window.dispatchEvent(new Event("cartChange"));
  }, [cartItems]);

  const { addToast } = useToast();

  // Item add karo — agar same variant aur size pehle se hai to quantity badhao
  const addToCart = useCallback(
    (product, variant, quantity = 1, selectedSize = "", selectedColor = "") => {
      const itemPrice = Number(
        variant.isSale && variant.salePrice ? variant.salePrice : variant.price
      ) || 0;
      const itemImage = variant.images?.[0] || (Array.isArray(product.images) ? product.images[0] : "") || "";
      const itemMaxStock = Number(variant.stock) || 10;
      const itemColor = selectedColor || variant.color || "";
      const itemSize = selectedSize || variant.size || "";

      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.productId === product._id &&
            item.variantId === variant._id &&
            item.size === itemSize,
        );

        if (existingIndex > -1) {
          // Pehle se hai — quantity badhao
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        // Naya item add karo
        return [
          ...prev,
          {
            productId: product._id,
            variantId: variant._id,
            name: product.name,
            color: itemColor,
            size: itemSize,
            price: itemPrice,
            image: itemImage,
            quantity,
            maxStock: itemMaxStock,
          },
        ];
      });

      // Trigger success notification
      const productName = product?.name || "Item";
      addToast(
        `"${productName.length > 28 ? productName.slice(0, 28) + "..." : productName}" added to cart successfully!`,
        "success",
        "bag",
        2800,
      );

      // Sync with backend with full details
      addToCartAPI({
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        image: itemImage,
        price: itemPrice,
        color: itemColor,
        size: itemSize,
        quantity,
        maxStock: itemMaxStock,
      }).catch((err) => console.error("Failed to save to backend cart", err));
    },
    [addToast],
  );

  // Quantity update karo
  const updateQuantity = useCallback((productId, variantId, size, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        item.variantId === variantId &&
        item.size === size
          ? { ...item, quantity }
          : item,
      ),
    );

    // Sync with backend
    updateCartAPI({
      productId,
      variantId,
      size,
      quantity,
    }).catch((err) => console.error("Failed to update backend cart", err));
  }, []);

  // Item remove karo
  const removeFromCart = useCallback(
    (productId, variantId, size) => {
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.variantId === variantId &&
              item.size === size
            ),
        ),
      );

      addToast("Item removed from cart", "info");

      // Sync with backend
      removeFromCartAPI({
        productId,
        variantId,
        size,
      }).catch((err) =>
        console.error("Failed to remove from backend cart", err),
      );
    },
    [addToast],
  );

  // Cart saaf karo
  const clearCart = useCallback(() => {
    setCartItems([]);
    saveCartToStorage([]);
    addToast("Cart cleared", "info");
    clearCartAPI().catch((err) =>
      console.error("Failed to clear backend cart", err)
    );
  }, [addToast]);

  // Total items count (for badge)
  const cartCount = cartItems.length;

  // Total price
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Kya item already cart mein hai?
  const isInCart = useCallback(
    (productId, variantId) =>
      cartItems.some(
        (item) => item.productId === productId && item.variantId === variantId,
      ),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook — components me easily use karo
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
