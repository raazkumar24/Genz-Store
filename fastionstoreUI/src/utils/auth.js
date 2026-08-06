export const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
        return null;
    }
};

export const getUserRole = () => {
    const user = getStoredUser();
    return localStorage.getItem('role') || user?.role || '';
};

export const isLoggedIn = () => Boolean(localStorage.getItem('token'));

export const isAdminUser = () => getUserRole().toLowerCase() === 'admin';

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    window.dispatchEvent(new Event('authChange'));
};
