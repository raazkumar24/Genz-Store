// Centralized and normalized API Base URL
const rawUrl = (import.meta.env.VITE_API_BASE_URL || "/api").trim().replace(/\/+$/, "");
export const API_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
export default API_URL;
