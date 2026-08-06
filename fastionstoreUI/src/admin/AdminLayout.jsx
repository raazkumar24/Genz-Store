import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Menu, X, PlusCircle } from 'lucide-react';
import { clearAuth } from '../utils/auth';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/login';
    };

    const getLinkClass = ({ isActive }) =>
        `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${
            isActive
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
        }`;

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]" style={{ fontFamily: 'var(--font-body)' }}>
            
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar Header with Brand/Logo */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                            <LayoutDashboard size={20} strokeWidth={2} />
                        </span>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                                SYSTEM
                            </h2>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Admin Panel</p>
                        </div>
                    </div>
                    <button 
                        className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 bg-white border-b border-gray-100">
                    <p className="px-4 text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">
                        Overview
                    </p>
                    
                    <NavLink to="/admin/dashboard" onClick={() => setIsSidebarOpen(false)} className={getLinkClass} end>
                        <LayoutDashboard size={20} strokeWidth={2.5} />
                        Dashboard
                    </NavLink>
                    
                    <NavLink to="/admin/products" onClick={() => setIsSidebarOpen(false)} className={getLinkClass} end>
                        <Package size={20} strokeWidth={2.5} />
                        Products
                    </NavLink>

                    <NavLink to="/admin/products/new" onClick={() => setIsSidebarOpen(false)} className={getLinkClass} end>
                        <PlusCircle size={20} strokeWidth={2.5} />
                        Add Product
                    </NavLink>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 bg-white">
                    <button 
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                    >
                        <LogOut size={18} strokeWidth={2} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative min-w-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_2px_2px,black_1px,transparent_0)] bg-[length:32px_32px]" />
                </div>

                {/* Topbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-10 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu for Mobile */}
                        <button 
                            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} strokeWidth={2} />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden md:block" style={{ fontFamily: 'var(--font-heading)' }}>
                            Admin Dashboard
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <NavLink to="/" className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800">
                            View Store
                        </NavLink>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-10 relative z-10">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
