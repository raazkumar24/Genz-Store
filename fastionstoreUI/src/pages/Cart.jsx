import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Card, Badge, Button, BackButton } from '../components/ui';

/**
 * Cart Page
 * - useCart hook se live cart items dikhata hai
 * - Quantity increase/decrease, remove item support
 * - Total price calculate karta hai
 */
const Cart = () => {
    const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="w-full max-w-md flex justify-start mb-6">
                    <BackButton />
                </div>
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-6 shadow-xs">
                    <ShoppingBag size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    Your Cart is Empty
                </h1>
                <p className="mt-3 text-gray-500 max-w-sm">
                    Looks like you haven't added anything yet. Start exploring our collection!
                </p>
                <Button to="/" variant="primary" size="lg" className="mt-8 flex items-center gap-2" icon={<ArrowRight size={18} />} iconPosition="right">
                    Shop Now
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton />
                </div>

                {/* ── Header ── */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                            Shopping <span className="text-transparent" style={{ WebkitTextStroke: '1px #111' }}>Cart</span>
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    {/* Clear cart button */}
                    <button
                        onClick={clearCart}
                        className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

                    {/* Cart Items — product image/name click se product page pe jayega */}
                    <div className="space-y-4">
                        {cartItems.map((item) => {
                            // Render size directly. If it's old comma-separated data, show the first one.
                            const displaySize = item.size ? item.size.split(',')[0].trim() : '';

                            // Product page URL with variant and size pre-selection
                            let productUrl = `/products/${item.productId}`;
                            const params = new URLSearchParams();
                            if (item.variantId) params.append('variant', item.variantId);
                            if (item.size) params.append('size', item.size);
                            
                            if (params.toString()) {
                                productUrl += `?${params.toString()}`;
                            }

                            return (
                            <Card key={`${item.productId}-${item.variantId}-${item.size}`} className="p-5">
                                <div className="flex gap-5">
                                    {/* Product Image — click se product page pe jayega */}
                                    <Link to={productUrl} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 hover:opacity-90 transition-opacity">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <ShoppingBag size={24} className="text-gray-300" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col gap-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                {/* Product name — click se product page */}
                                                <Link
                                                    to={productUrl}
                                                    className="font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-[var(--color-primary)] transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                    {/* Color badge */}
                                                    {item.color && (
                                                        <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">
                                                            {item.color}
                                                        </Badge>
                                                    )}
                                                    {/* Size badge */}
                                                    {displaySize && (
                                                        <Badge variant="secondary" className="px-2 py-0.5 text-[10px]">
                                                            Size: {displaySize}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Remove button */}
                                            <button
                                                onClick={() => removeFromCart(item.productId, item.variantId, item.size)}
                                                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            {/* Price */}
                                            <span className="text-lg font-bold text-gray-900">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>

                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.variantId, item.size, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-6 text-center text-sm font-bold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.variantId, item.size, item.quantity + 1)}
                                                    disabled={item.maxStock && item.quantity >= item.maxStock}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-30"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            );
                        })}
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span className="font-semibold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button fullWidth variant="primary" size="lg" className="mt-6 flex items-center justify-center gap-2" icon={<ArrowRight size={18} />} iconPosition="right">
                                Checkout
                            </Button>

                            <Link
                                to="/"
                                className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                ← Continue Shopping
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
