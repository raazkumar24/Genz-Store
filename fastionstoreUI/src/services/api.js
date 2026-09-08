// Centralized API Base URL
// VITE_API_BASE_URL = https://genz-store-x36t.onrender.com/api (set in .env)
const rawUrl = (import.meta.env.VITE_API_BASE_URL || "/api").trim().replace(/\/+$/, "");

// Ensure URL ends with /api exactly once
export const API_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;

export default API_URL;
