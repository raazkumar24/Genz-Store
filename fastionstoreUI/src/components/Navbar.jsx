import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, User, LogOut, Shield } from "lucide-react";
import { Button } from "./ui";
import { clearAuth, isAdminUser, isLoggedIn as hasAuthToken } from '../utils/auth';
import SearchBox from './SearchBox';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    // Real cart count from CartContext
    const { cartCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAdminLink, setShowAdminLink] = useState(isAdminUser());
    const [isLoggedIn, setIsLoggedIn] = useState(hasAuthToken());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const location = useLocation();

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'New Arrivals', to: '/new-arrivals' },
        { label: 'Sale', to: '/sale', isSale: true },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
    ];

    const collectionLinks = [
        { label: 'Oversized Tees', to: '/collections/oversized-tees' },
        { label: 'Hoodies', to: '/collections/hoodies' },
        { label: 'Cargos', to: '/collections/baggy-pants' },
        { label: 'Menswear', to: '/collections/men' },
        { label: 'Womenswear', to: '/collections/women' },
    ];

    // Modern Premium Navbar
    const navbarSurface = isScrolled || isMobileMenuOpen
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-3'
        : 'bg-white border-b border-transparent py-5';

    const desktopNavLinkClass = ({ isActive }) =>
        `relative px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg ${
            isActive
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `flex items-center justify-between border-b border-gray-100 py-4 text-lg font-semibold uppercase tracking-wider transition-all ${
            isActive
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
        }`;

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const actionIconButtonClass =
        'flex items-center justify-center p-2 rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const syncAuthState = () => {
            setShowAdminLink(isAdminUser());
            setIsLoggedIn(hasAuthToken());
        };
        window.addEventListener('storage', syncAuthState);
        window.addEventListener('authChange', syncAuthState);
        return () => {
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener('authChange', syncAuthState);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        closeMobileMenu();
    }, [location.pathname]);

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/login';
    };

    return (
        <header className={`w-full z-50 transition-all duration-300 ${navbarSurface}`}>
            <div className="mx-auto max-w-7xl px-6 md:px-8">
                {/* Mobile Navbar */}
                <nav className="flex items-center justify-between md:hidden" style={{ fontFamily: 'var(--font-body)' }}>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            aria-label="Open menu"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                        <button aria-label="Search" onClick={() => setShowSearch(!showSearch)} className="text-[var(--color-text)] hover:text-[var(--color-primary)]">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                    </div>

                    <NavLink to="/" onClick={closeMobileMenu} className="flex items-center absolute left-1/2 -translate-x-1/2">
                        <img src="/genz_logo.png" alt="Gen Z Logo" className="w-24 object-contain" />
                    </NavLink>

                    <div className="flex items-center gap-4">
                        <NavLink to="/cart" aria-label="Cart" onClick={closeMobileMenu} className="relative text-[var(--color-text)] hover:text-[var(--color-primary)]">
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>
                    </div>

                    {/* Mobile Menu Drawer */}
                    <div className={`fixed inset-0 top-0 left-0 h-[100dvh] w-full bg-white z-50 transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                        <div className="flex flex-col h-full bg-[var(--color-bg)]">
                            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                                <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Menu</span>
                                <button onClick={closeMobileMenu} className="text-[var(--color-text)] hover:text-[var(--color-primary)]">
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <div className="flex flex-col">
                                    {navLinks.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            onClick={closeMobileMenu}
                                            className={mobileNavLinkClass}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ))}
                                    
                                    <div className="mt-8">
                                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">Collections</p>
                                        <div className="flex flex-col">
                                            {collectionLinks.map((link) => (
                                                <NavLink key={link.to} to={link.to} onClick={closeMobileMenu} className={mobileNavLinkClass}>
                                                    {link.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-white border-t border-[var(--color-border)] grid grid-cols-2 gap-4">
                                {isLoggedIn ? (
                                    <>
                                        <NavLink to="/profile" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] py-3 text-sm font-semibold">
                                            <User size={18} /> Profile
                                        </NavLink>
                                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-text)] text-white py-3 text-sm font-semibold">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <NavLink to="/login" onClick={closeMobileMenu} className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-[var(--color-text)] text-white py-3 text-sm font-semibold">
                                        <User size={18} /> Sign In
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Dropdown */}
                    <div className={`absolute top-full left-0 w-full bg-white border-b border-[var(--color-border)] p-4 transition-all duration-300 ${
                        showSearch ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
                    }`}>
                        <SearchBox className="w-full" placeholder="Search the store..." onSearch={() => setShowSearch(false)} />
                    </div>
                </nav>

                {/* Desktop Navbar */}
                <nav className="hidden items-center justify-between md:flex" style={{ fontFamily: 'var(--font-heading)' }}>
                    
                    {/* Left: Brand */}
                    <div className="flex-1">
                        <NavLink to="/" className="inline-block">
                            <img src="/genz_logo.png" alt="Gen Z Logo" className="h-8 w-auto object-contain" />
                        </NavLink>
                    </div>

                    {/* Center: Links */}
                    <div className="flex items-center justify-center gap-10 flex-auto">
                        <NavLink to="/" className={desktopNavLinkClass}>
                            Home
                        </NavLink>

                        <div className="relative group py-4">
                            <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                                Collections
                                <ChevronDown size={14} strokeWidth={2} className="transition-transform group-hover:rotate-180" />
                            </button>
                            
                            <div className="absolute left-1/2 -translate-x-1/2 top-[100%] w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                                <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
                                <div className="rounded-2xl border border-gray-100 bg-white py-2 shadow-lg">
                                    {collectionLinks.map((link) => (
                                        <NavLink key={link.to} to={link.to} className="block px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900">
                                            {link.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <NavLink to="/new-arrivals" className={desktopNavLinkClass}>
                            New Arrivals
                        </NavLink>

                        <NavLink to="/sale" className={({ isActive }) => `relative px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 rounded-lg ${isActive ? 'text-white bg-red-500' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}>
                            Sale
                        </NavLink>
                        
                        <NavLink to="/about" className={desktopNavLinkClass}>
                            About
                        </NavLink>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-6 flex-1">
                        {/* Search */}
                        <div className="relative flex items-center">
                            {showSearch ? (
                                <div className="w-64 animate-fade-in flex items-center gap-2">
                                    <SearchBox 
                                        className="w-full bg-white py-1 pl-3 pr-1" 
                                        placeholder="Search..." 
                                        onSearch={() => setShowSearch(false)} 
                                    />
                                    <button aria-label="Close Search" onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                        <X size={20} strokeWidth={1.5} />
                                    </button>
                                </div>
                            ) : (
                                <button aria-label="Search" onClick={() => setShowSearch(true)} className={actionIconButtonClass}>
                                    <Search size={20} strokeWidth={1.5} />
                                </button>
                            )}
                        </div>

                        <div className={`flex items-center gap-6 transition-opacity duration-200 ${showSearch ? 'opacity-0 pointer-events-none w-0 overflow-hidden' : 'opacity-100'}`}>
                            <button aria-label="Wishlist" className={actionIconButtonClass}>
                                <Heart size={20} strokeWidth={1.5} />
                            </button>

                            <NavLink to="/cart" aria-label="Cart" className={`relative ${actionIconButtonClass}`}>
                                <ShoppingCart size={20} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </NavLink>

                            <div className="w-[1px] h-4 bg-[var(--color-border)]"></div>

                            {showAdminLink && (
                                <NavLink to="/admin" aria-label="Admin Panel" className={actionIconButtonClass}>
                                    <Shield size={20} strokeWidth={2} />
                                </NavLink>
                            )}

                            {isLoggedIn ? (
                                <div className="relative group py-2">
                                    <NavLink to="/profile" className={actionIconButtonClass}>
                                        <User size={20} strokeWidth={1.5} />
                                    </NavLink>
                                    <div className="absolute right-0 top-[100%] w-40 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                                        <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" />
                                        <div className="rounded-2xl border border-gray-100 bg-white py-2 shadow-lg">
                                            <button onClick={handleLogout} className="flex w-full items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-50">
                                                <LogOut size={16} strokeWidth={2} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Button to="/login" variant="primary" size="sm" className="px-6">
                                    Log In
                                </Button>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
