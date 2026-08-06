import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Mail, Shield, User as UserIcon, LogOut, Settings, Package } from 'lucide-react';
import { getStoredUser, getUserRole, isLoggedIn, clearAuth } from '../utils/auth';
import { Card, Badge, Button } from '../components/ui';

/**
 * User Profile Page
 * - Logged-in user ki details dikhata hai (name, email, role)
 * - Admin users ko admin panel ka shortcut bhi milta hai
 * - Logout button se localStorage clear ho jata hai
 */
const User = () => {
    // Agar logged in nahi hai to login page pe redirect karo
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    const user = getStoredUser();
    const role = getUserRole() || 'user';
    const isAdmin = role.toLowerCase() === 'admin';

    // Display name: prefer name, fallback to email prefix
    const displayName = user?.name || user?.email?.split('@')[0] || 'User';
    const email = user?.email || '—';

    // Avatar initials (first letter of name)
    const initials = displayName.charAt(0).toUpperCase();

    // Logout handler
    const handleLogout = () => {
        clearAuth();
        window.location.href = '/';
    };

    return (
        <section className="min-h-screen bg-[var(--color-bg)] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Subtle dot grid background */}
            <div className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none">
                <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl">

                {/* ── Page Header ── */}
                <div className="mb-10">
                    <Badge variant="primary" className="mb-4 px-3 py-1 inline-flex items-center gap-2">
                        <UserIcon size={14} />
                        My Account
                    </Badge>
                    <h1
                        className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Profile
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Your account information and settings.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">

                    {/* ── Left Card — Avatar & Name ── */}
                    <Card className="p-8 flex flex-col items-center text-center gap-5">

                        {/* Avatar circle with initials */}
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white text-4xl font-black shadow-lg select-none">
                            {initials}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                                {displayName}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 break-all">{email}</p>
                        </div>

                        {/* Role badge */}
                        <Badge variant={isAdmin ? 'primary' : 'secondary'} className="flex items-center gap-1.5 px-3 py-1.5">
                            <Shield size={13} />
                            {isAdmin ? 'Administrator' : 'Customer'}
                        </Badge>

                        {/* Admin shortcut */}
                        {isAdmin && (
                            <Link
                                to="/admin/products"
                                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Settings size={16} />
                                Admin Panel
                            </Link>
                        )}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </Card>

                    {/* ── Right Card — Details ── */}
                    <Card className="p-8">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
                            Account Details
                        </h2>

                        <div className="space-y-4">
                            {/* Name row */}
                            <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm shrink-0">
                                    <UserIcon size={20} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Full Name</p>
                                    <p className="mt-0.5 font-semibold text-gray-900">{displayName}</p>
                                </div>
                            </div>

                            {/* Email row */}
                            <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm shrink-0">
                                    <Mail size={20} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</p>
                                    <p className="mt-0.5 font-semibold text-gray-900 break-all">{email}</p>
                                </div>
                            </div>

                            {/* Role row */}
                            <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm shrink-0">
                                    <Shield size={20} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Account Role</p>
                                    <p className="mt-0.5 font-semibold text-gray-900 capitalize">{role}</p>
                                </div>
                            </div>

                            {/* Orders placeholder (future feature) */}
                            <div className="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm shrink-0">
                                    <Package size={20} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">My Orders</p>
                                    <p className="mt-0.5 text-sm text-gray-400 italic">Coming soon…</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Note about email update ── */}
                        <p className="mt-6 text-xs text-gray-400">
                            💡 Email updated after login? Logout and login again to see fresh data.
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default User;
