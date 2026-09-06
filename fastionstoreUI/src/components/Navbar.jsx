import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { NavLink, useLocation } from 'react-router-dom';
=======
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  Shield, 
  Flame, 
<<<<<<< HEAD
=======
  Sparkles, 
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
  ChevronRight,
  Layers
} from "lucide-react";
import { Button } from "./ui";
import { clearAuth, isAdminUser, isLoggedIn as hasAuthToken, getStoredUser } from '../utils/auth';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchModal from './SearchModal';

const Navbar = () => {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAdminLink, setShowAdminLink] = useState(isAdminUser());
    const [isLoggedIn, setIsLoggedIn] = useState(hasAuthToken());
    const [currentUser, setCurrentUser] = useState(getStoredUser());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCollectionsOpenMobile, setIsCollectionsOpenMobile] = useState(true);
    
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'New Arrivals', to: '/new-arrivals', badge: 'NEW', badgeColor: 'bg-emerald-500' },
        { label: 'Clearance Sale', to: '/sale', isSale: true, badge: 'HOT', badgeColor: 'bg-[var(--color-primary)]' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
    ];

    const collectionLinks = [
        { label: 'Oversized Tees', to: '/collections/oversized-tees', desc: 'Heavyweight 280+ GSM Boxy Cuts' },
        { label: 'Hoodies & Sweats', to: '/collections/hoodies', desc: 'Relaxed Fleece & Drop Shoulders' },
        { label: 'Cargos & Bottoms', to: '/collections/cargos', desc: 'Parachute, Baggy & Multi-Pocket' },
        { label: "Men's Streetwear", to: '/collections/men', desc: 'Core Oversized Fits & Neutral Tones' },
        { label: "Women's Fits", to: '/collections/women', desc: 'Crop Tees, Oversized & Street Drops' },
    ];

    // Detect scroll for backdrop blur and dynamic styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 12);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sync auth state across tabs and events
    useEffect(() => {
        const syncAuthState = () => {
            setShowAdminLink(isAdminUser());
            setIsLoggedIn(hasAuthToken());
            setCurrentUser(getStoredUser());
        };
        window.addEventListener('storage', syncAuthState);
        window.addEventListener('authChange', syncAuthState);
        return () => {
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener('authChange', syncAuthState);
        };
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    // Close mobile drawer on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        clearAuth();
        setIsLoggedIn(false);
        setShowAdminLink(false);
        setIsMobileMenuOpen(false);
        window.location.href = '/login';
    };

    const actionIconButtonClass =
        'relative flex items-center justify-center h-10 w-10 rounded-full text-neutral-800 transition-all duration-200 hover:bg-neutral-100 hover:text-black cursor-pointer';

    return (
        <>
            <header
                className={`w-full z-40 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/90 backdrop-blur-xl border-b border-black/[0.08] shadow-xs py-2.5 sm:py-3'
                        : 'bg-[#F7F7F4]/95 backdrop-blur-md border-b border-black/[0.04] py-3 sm:py-4'
                }`}
            >
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    {/* Mobile Navbar (Visible on screens < md) */}
                    <nav className="flex items-center justify-between md:hidden">
                        <div className="flex items-center gap-1">
                            {/* Hamburger Menu Toggle Button */}
                            <button
                                type="button"
                                aria-label="Open navigation menu"
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-200/60 active:scale-95 transition-all cursor-pointer"
                            >
                                <Menu size={22} strokeWidth={2.2} />
                            </button>

                            {/* Mobile Quick Search Button */}
                            <button
                                type="button"
                                aria-label="Search Streetwear"
                                onClick={() => setIsSearchModalOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-200/60 active:scale-95 transition-all cursor-pointer"
                            >
                                <Search size={20} strokeWidth={2.2} />
                            </button>
                        </div>

                        {/* Centered Brand Logo */}
                        <NavLink to="/" className="flex items-center transition-transform active:scale-95">
                            <img src="/genz_logo.png" alt="Gen Z Store" className="h-7 sm:h-8 w-auto object-contain" />
                        </NavLink>

                        {/* Right Quick Actions: Wishlist & Cart */}
                        <div className="flex items-center gap-1">
                            <NavLink
                                to="/wishlist"
                                aria-label="My Wishlist"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-200/60 transition-colors"
                            >
                                <Heart size={20} strokeWidth={2} />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-black text-white shadow-xs animate-pulse">
                                        {wishlistCount}
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/cart"
                                aria-label="Shopping Cart"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 hover:bg-neutral-200/60 transition-colors"
                            >
                                <ShoppingBag size={20} strokeWidth={2} />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0.6 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-black text-white shadow-xs"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </NavLink>
                        </div>
                    </nav>

                    {/* Desktop Navbar (Visible on screens >= md) */}
                    <nav className="hidden items-center justify-between md:flex">
                        {/* Left: Brand Logo */}
                        <div className="flex items-center gap-8">
                            <NavLink to="/" className="inline-flex items-center transition-transform hover:scale-102">
                                <img src="/genz_logo.png" alt="Gen Z Logo" className="h-8 w-auto object-contain" />
                            </NavLink>
                        </div>

                        {/* Center: Navigation Links */}
                        <div className="flex items-center gap-1 lg:gap-2">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full ${
                                        isActive
                                            ? 'text-black bg-neutral-200/70 font-extrabold'
                                            : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40'
                                    }`
                                }
                            >
                                Home
                            </NavLink>

                            {/* Collections Dropdown */}
                            <div className="relative group py-2">
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-200/40 cursor-pointer"
                                >
                                    Collections
                                    <ChevronDown size={14} strokeWidth={2.5} className="transition-transform duration-200 group-hover:rotate-180" />
                                </button>

                                <div className="absolute left-1/2 -translate-x-1/2 top-[100%] w-72 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                                    <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent" />
                                    <div className="rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-xl p-2 shadow-xl">
                                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 flex items-center justify-between">
                                            <span>Curated Drops</span>
<<<<<<< HEAD
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"></span>
=======
                                            <Sparkles size={11} className="text-amber-500" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                                        </div>
                                        {collectionLinks.map((link) => (
                                            <NavLink
                                                key={link.to}
                                                to={link.to}
                                                className="flex flex-col px-3.5 py-2 rounded-xl transition-colors hover:bg-neutral-100/80 group/item"
                                            >
                                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover/item:text-[var(--color-primary)] transition-colors">
                                                    {link.label}
                                                </span>
                                                <span className="text-[11px] text-neutral-500 font-medium">
                                                    {link.desc}
                                                </span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <NavLink
                                to="/new-arrivals"
                                className={({ isActive }) =>
                                    `relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full ${
                                        isActive
                                            ? 'text-black bg-neutral-200/70 font-extrabold'
                                            : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40'
                                    }`
                                }
                            >
                                New Arrivals
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </NavLink>

                            <NavLink
                                to="/sale"
                                className={({ isActive }) =>
                                    `relative flex items-center gap-1 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full ${
                                        isActive
                                            ? 'text-white bg-[var(--color-primary)] shadow-sm shadow-[var(--color-primary)]/30 font-extrabold'
                                            : 'text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 font-extrabold'
                                    }`
                                }
                            >
                                <Flame size={13} className="fill-[var(--color-primary)]" />
                                Sale
                            </NavLink>

                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full ${
                                        isActive
                                            ? 'text-black bg-neutral-200/70 font-extrabold'
                                            : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40'
                                    }`
                                }
                            >
                                About
                            </NavLink>

                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full ${
                                        isActive
                                            ? 'text-black bg-neutral-200/70 font-extrabold'
                                            : 'text-neutral-600 hover:text-black hover:bg-neutral-200/40'
                                    }`
                                }
                            >
                                Contact
                            </NavLink>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search Modal Trigger Button */}
                            <button
                                type="button"
                                aria-label="Open Search"
                                onClick={() => setIsSearchModalOpen(true)}
                                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-all shadow-2xs cursor-pointer"
                            >
                                <Search size={15} strokeWidth={2.2} className="text-neutral-500" />
                                <span className="hidden lg:inline">Search streetwear...</span>
                                <span className="lg:hidden">Search</span>
<<<<<<< HEAD
=======
                                <kbd className="hidden lg:inline-flex rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                                    ⌘K
                                </kbd>
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                            </button>

                            {/* Wishlist */}
                            <NavLink
                                to="/wishlist"
                                aria-label="Wishlist"
                                className={actionIconButtonClass}
                            >
                                <Heart size={19} strokeWidth={2} />
                                {wishlistCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0.6 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-black text-white shadow-xs"
                                    >
                                        {wishlistCount}
                                    </motion.span>
                                )}
                            </NavLink>

                            {/* Cart */}
                            <NavLink
                                to="/cart"
                                aria-label="Cart"
                                className={actionIconButtonClass}
                            >
                                <ShoppingBag size={19} strokeWidth={2} />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0.6 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-black text-white shadow-xs"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </NavLink>

                            <div className="w-[1px] h-5 bg-neutral-300 mx-1"></div>

                            {/* Admin Link if Admin */}
                            {showAdminLink && (
                                <NavLink
                                    to="/admin"
                                    aria-label="Admin Panel"
                                    className={`${actionIconButtonClass} text-neutral-700 hover:text-[var(--color-primary)]`}
                                    title="Admin Dashboard"
                                >
                                    <Shield size={19} strokeWidth={2} />
                                </NavLink>
                            )}

                            {/* User Profile / Auth */}
                            {isLoggedIn ? (
                                <div className="relative group py-2">
                                    <NavLink to="/profile" className={actionIconButtonClass}>
                                        <User size={19} strokeWidth={2} />
                                    </NavLink>
                                    <div className="absolute right-0 top-[100%] w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                                        <div className="rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-xl p-2 shadow-xl">
                                            <div className="px-3 py-1.5 border-b border-neutral-100 mb-1">
                                                <p className="text-[10px] font-black uppercase text-neutral-400">Signed In</p>
                                                <p className="text-xs font-bold text-neutral-900 truncate">
                                                    {currentUser?.name || currentUser?.email || 'Streetwear Member'}
                                                </p>
                                            </div>
                                            <NavLink
                                                to="/profile"
                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 rounded-xl"
                                            >
                                                <User size={15} /> My Profile & Orders
                                            </NavLink>
                                            {showAdminLink && (
                                                <NavLink
                                                    to="/admin"
                                                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-xl"
                                                >
                                                    <Shield size={15} /> Admin Portal
                                                </NavLink>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                            >
                                                <LogOut size={15} strokeWidth={2} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Button to="/login" variant="primary" size="sm" className="px-5 text-xs font-extrabold">
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Drawer (Rock-solid, fully touch-responsive with z-[100]) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] md:hidden">
                        {/* Dark Backdrop with tap-to-close */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Sliding Sidebar Sheet */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[88%] max-w-sm bg-[#F7F7F4] shadow-2xl flex flex-col h-full z-10 overflow-hidden"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-4 px-5 border-b border-neutral-200/80 bg-white">
                                <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                                    <img src="/genz_logo.png" alt="Gen Z Logo" className="h-7 w-auto object-contain" />
                                </NavLink>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close navigation menu"
                                    className="p-2 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors"
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Search Trigger inside Mobile Drawer */}
                            <div className="p-4 bg-white border-b border-neutral-200/80">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsSearchModalOpen(true);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-2xl bg-neutral-100 px-4 py-2.5 text-xs font-bold text-neutral-500 hover:bg-neutral-200 transition-colors"
                                >
                                    <Search size={16} strokeWidth={2.5} className="text-neutral-400" />
                                    <span>Search drops, tees, cargos...</span>
                                </button>
                            </div>

                            {/* Scrollable Navigation Body */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                {/* Primary Navigation Links */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-3 mb-2">
                                        Explore Menu
                                    </p>
                                    {navLinks.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                                                    isActive
                                                        ? 'bg-neutral-900 text-white shadow-xs'
                                                        : 'text-neutral-800 hover:bg-neutral-200/60'
                                                }`
                                            }
                                        >
                                            <span className="flex items-center gap-2">
                                                {link.isSale && <Flame size={14} className="text-[var(--color-primary)]" />}
                                                {link.label}
                                            </span>
                                            {link.badge && (
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white ${link.badgeColor}`}>
                                                    {link.badge}
                                                </span>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>

                                {/* Collections Accordion / List */}
                                <div className="space-y-2 pt-2 border-t border-neutral-200/80">
                                    <button
                                        type="button"
                                        onClick={() => setIsCollectionsOpenMobile(!isCollectionsOpenMobile)}
                                        className="flex w-full items-center justify-between px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <Layers size={13} /> Streetwear Drops & Fits
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-200 ${
                                                isCollectionsOpenMobile ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>

                                    {isCollectionsOpenMobile && (
                                        <div className="space-y-1 pl-1">
                                            {collectionLinks.map((col) => (
                                                <NavLink
                                                    key={col.to}
                                                    to={col.to}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-200/60 transition-colors group"
                                                >
                                                    <div>
                                                        <span className="block text-neutral-900 group-hover:text-[var(--color-primary)]">
                                                            {col.label}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400 font-normal">
                                                            {col.desc}
                                                        </span>
                                                    </div>
                                                    <ChevronRight size={14} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Shortcuts: Wishlist & Cart & Admin */}
                                <div className="pt-2 border-t border-neutral-200/80 space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-3 mb-2">
                                        Your Bag
                                    </p>
                                    <NavLink
                                        to="/wishlist"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-200/60 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Heart size={16} /> Saved Wishlist
                                        </span>
                                        {wishlistCount > 0 && (
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[10px] font-black text-white">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </NavLink>

                                    <NavLink
                                        to="/cart"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-200/60 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <ShoppingBag size={16} /> Shopping Cart
                                        </span>
                                        {cartCount > 0 && (
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[10px] font-black text-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </NavLink>

                                    {showAdminLink && (
                                        <NavLink
                                            to="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Shield size={16} /> Admin Portal
                                            </span>
                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[var(--color-primary)] text-white">
                                                ADMIN
                                            </span>
                                        </NavLink>
                                    )}
                                </div>
                            </div>

                            {/* Mobile User Authentication Footer */}
                            <div className="p-4 bg-white border-t border-neutral-200/80 space-y-3">
                                {isLoggedIn ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 px-2 py-1">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-black">
                                                {(currentUser?.name || currentUser?.email || 'U')[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-neutral-900 truncate">
                                                    {currentUser?.name || 'Streetwear Member'}
                                                </p>
                                                <p className="text-[10px] text-neutral-500 truncate">
                                                    {currentUser?.email || 'Active Account'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <NavLink
                                                to="/profile"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100"
                                            >
                                                <User size={14} /> Profile
                                            </NavLink>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-red-100 cursor-pointer"
                                            >
                                                <LogOut size={14} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            to="/login"
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-xs font-bold uppercase"
                                        >
                                            Sign In
                                        </Button>
                                        <NavLink
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center rounded-full border border-neutral-300 py-2 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100"
                                        >
                                            Register
                                        </NavLink>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Global Search Modal */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />
        </>
    );
};

export default Navbar;
