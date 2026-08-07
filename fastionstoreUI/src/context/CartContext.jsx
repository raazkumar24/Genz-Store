import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addToCartAPI, updateCartAPI, removeFromCartAPI, fetchCartAPI } from '../services/cartService';

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

const CART_STORAGE_KEY = 'fashionstore_cart';

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
        console.error('Cart save failed:', e);
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(loadCartFromStorage);

    // Initial cart load from backend if user is logged in
    useEffect(() => {
        const loadBackendCart = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // pass 'me' or any string as userId since backend uses req.user.id
                    const response = await fetchCartAPI('me');
                    if (response && response.items) {
                        const fetchedItems = response.items.map(item => {
                            const product = item.product || {};
                            const variant = product.variants?.find(v => v._id === item.variantId) || {};
                            return {
                                productId: product._id,
                                variantId: item.variantId,
                                name: product.name,
                                color: item.color,
                                size: item.size,
                                price: variant.isSale && variant.salePrice ? variant.salePrice : variant.price,
                                image: variant.images?.[0] || '',
                                quantity: item.quantity,
                                maxStock: variant.stock || 10,
                            };
                        });
                        setCartItems(fetchedItems);
                    }
                } catch (error) {
                    console.error("Failed to fetch cart from backend", error);
                }
            }
        };

        const handleAuthChange = () => {
            const token = localStorage.getItem('token');
            if (token) {
                loadBackendCart();
            } else {
                // If logged out, clear cart or load from local storage
                setCartItems(loadCartFromStorage());
            }
        };

        window.addEventListener('authChange', handleAuthChange);
        loadBackendCart();

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    // Jab bhi cartItems change ho, storage update karo
    useEffect(() => {
        saveCartToStorage(cartItems);
        // Navbar cart count update ke liye event dispatch
        window.dispatchEvent(new Event('cartChange'));
    }, [cartItems]);

    // Item add karo — agar same variant aur size pehle se hai to quantity badhao
    const addToCart = useCallback((product, variant, quantity = 1, selectedSize = '', selectedColor = '') => {
        setCartItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.productId === product._id && item.variantId === variant._id && item.size === selectedSize
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
                    color: selectedColor || variant.color || '',
                    size: selectedSize || variant.size || '',
                    price: variant.isSale && variant.salePrice ? variant.salePrice : variant.price,
                    image: variant.images?.[0] || '',
                    quantity,
                    maxStock: variant.stock || 10,
                },
            ];
        });

        // Sync with backend
        addToCartAPI({
            productId: product._id,
            variantId: variant._id,
            color: selectedColor || variant.color || '',
            size: selectedSize || variant.size || '',
            quantity
        }).catch(err => console.error('Failed to save to backend cart', err));

    }, []);

    // Quantity update karo
    const updateQuantity = useCallback((productId, variantId, size, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId && item.variantId === variantId && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );

        // Sync with backend
        updateCartAPI({
            productId,
            variantId,
            size,
            quantity
        }).catch(err => console.error('Failed to update backend cart', err));
    }, []);

    // Item remove karo
    const removeFromCart = useCallback((productId, variantId, size) => {
        setCartItems((prev) =>
            prev.filter(
                (item) => !(item.productId === productId && item.variantId === variantId && item.size === size)
            )
        );

        // Sync with backend
        removeFromCartAPI({
            productId,
            variantId,
            size
        }).catch(err => console.error('Failed to remove from backend cart', err));
    }, []);

    // Cart saaf karo
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    // Total items count (for badge)
    const cartCount = cartItems.length;

    // Total price
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Kya item already cart mein hai?
    const isInCart = useCallback(
        (productId, variantId) =>
            cartItems.some(
                (item) => item.productId === productId && item.variantId === variantId
            ),
        [cartItems]
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
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
