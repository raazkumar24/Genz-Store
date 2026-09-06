import React, { useState, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Layers,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { clearAuth, getUser } from "../utils/auth";
import { useProducts } from "../context/ProductContext";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { products } = useProducts();
  const currentUser = getUser();

  // Compute live counts
  const lowStockCount = useMemo(() => {
    return (products || []).filter((p) => {
      const total = (p.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
      return total <= 5;
    }).length;
  }, [products]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  const getLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${
      isActive
        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm shadow-blue-500/20"
        : "bg-transparent text-gray-600 border-transparent hover:bg-gray-100/80 hover:text-gray-900"
    }`;

  // Page title mapping based on pathname
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes("/admin/products/new")) return "Add New Product Drop";
    if (p.includes("/admin/products/edit")) return "Edit Product Details";
    if (p.includes("/admin/products")) return "Product Inventory";
    if (p.includes("/admin/collections")) return "Collections & Banners";
    return "Store Overview";
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F8FAFC]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white border-r border-gray-200 shadow-xl md:shadow-none transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header with Brand/Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <h2
                  className="text-lg font-black tracking-tight text-gray-900 uppercase"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  FASTION
                </h2>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-gray-900 text-white rounded">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-400">
                Management Console
              </p>
            </div>
          </div>
          <button
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin User Mini Card */}
        <div className="px-5 py-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/80 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {currentUser?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {currentUser?.name || "System Admin"}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Super Admin Access
            </div>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto py-5 px-4 space-y-1.5 bg-white">
          <p className="px-4 text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">
            Main Menu
          </p>

          <NavLink
            to="/admin/dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className={getLinkClass}
            end
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={19} strokeWidth={2.2} />
              <span>Dashboard</span>
            </div>
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={() => setIsSidebarOpen(false)}
            className={getLinkClass}
            end
          >
            <div className="flex items-center gap-3">
              <Package size={19} strokeWidth={2.2} />
              <span>Products</span>
            </div>
            <div className="flex items-center gap-1">
              {lowStockCount > 0 && (
                <span
                  title={`${lowStockCount} items need restock`}
                  className="flex h-5 px-1.5 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold"
                >
                  !
                </span>
              )}
              <span className="flex h-5 px-2 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold group-[.active]:bg-white/20 group-[.active]:text-white">
                {products?.length || 0}
              </span>
            </div>
          </NavLink>

          <NavLink
            to="/admin/products/new"
            onClick={() => setIsSidebarOpen(false)}
            className={getLinkClass}
            end
          >
            <div className="flex items-center gap-3">
              <PlusCircle size={19} strokeWidth={2.2} />
              <span>Add New Drop</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
              New
            </span>
          </NavLink>

          <NavLink
            to="/admin/collections"
            onClick={() => setIsSidebarOpen(false)}
            className={getLinkClass}
            end
          >
            <div className="flex items-center gap-3">
              <Layers size={19} strokeWidth={2.2} />
              <span>Collections</span>
            </div>
          </NavLink>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-2">
          <NavLink
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-wider"
          >
            <ExternalLink size={14} />
            Open Storefront
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 uppercase tracking-wider"
          >
            <LogOut size={15} strokeWidth={2.2} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F8FAFC] relative min-w-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_2px_2px,black_1px,transparent_0)] bg-[length:32px_32px]" />
        </div>

        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur-md px-6 md:px-10 z-10 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu for Mobile */}
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} strokeWidth={2} />
            </button>
            <div>
              <h1
                className="text-lg font-black tracking-tight text-gray-900"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {getPageTitle()}
              </h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Store inventory, analytics & catalog manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Catalog Active</span>
            </div>

            {lowStockCount > 0 && (
              <NavLink
                to="/admin/products"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <AlertTriangle size={14} className="text-amber-600" />
                <span>{lowStockCount} Low Stock</span>
              </NavLink>
            )}

            <NavLink
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-gray-800 shadow-sm"
            >
              <ShieldCheck size={14} />
              <span>Storefront</span>
            </NavLink>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 lg:p-10 relative z-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
