/**
 * context/AuthContext.jsx
 * Global authentication state for the entire React app.
 *
 * Provides:
 * - user, token — current session data
 * - loading — true while restoring session from localStorage / verifying token
 * - login(user, token) — save session to state + localStorage
 * - logout() — clear session everywhere
 * - useAuth() — hook to access auth state in any component
 *
 * On app load, if a token exists in localStorage, it calls GET /auth/me
 * to verify the token is still valid and refresh user data.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCurrentUser } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const login = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // Restore session on page load / refresh
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!savedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      if (isMounted) setToken(savedToken);

      // Optimistically restore user from localStorage for faster UI
      if (savedUser) {
        try {
          if (isMounted) setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      // Verify token with backend
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setUser(data.data.user);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    restoreSession();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
