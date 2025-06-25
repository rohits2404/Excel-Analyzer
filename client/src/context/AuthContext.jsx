import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct named import for Vite

// 1. Create Context
export const AuthContext = createContext();

// 2. Custom Hook
export const useAuth = () => useContext(AuthContext);

// 3. AuthProvider
export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [logoutTimer, setLogoutTimer] = useState(null);
    const [loading, setLoading] = useState(true); // Track auth loading

    // Get expiry time from JWT token
    const getTokenExpiry = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000; // convert to ms
        } catch (err) {
            return null;
        }
    };

    // Auto logout after token expires
    const scheduleAutoLogout = (delay) => {
        if (logoutTimer) clearTimeout(logoutTimer);
            const timer = setTimeout(() => {
            logout();
        }, delay);
        setLogoutTimer(timer);
    };

    // Login logic
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        const expiry = getTokenExpiry(userData.token);
        if (expiry) {
            scheduleAutoLogout(expiry - Date.now());
        }
    };

    // Logout logic
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        if (logoutTimer) clearTimeout(logoutTimer);
    };

    // On first load, check localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.token) {
            const expiry = getTokenExpiry(storedUser.token);
            if (expiry && Date.now() < expiry) {
                setUser(storedUser);
                scheduleAutoLogout(expiry - Date.now());
            } else {
                logout();
            }
        }
        setLoading(false); // ✅ Mark loading complete
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children} {/* ✅ Wait for loading */}
        </AuthContext.Provider>
    );
};