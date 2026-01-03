import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(undefined);

const STORAGE_TOKEN_KEY = "authToken";
const STORAGE_USER_KEY = "userData";

function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return String(raw).replace(/\/+$/, "");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (activeToken) => {
    const t = activeToken || token;
    if (!t) return null;

    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${t}`,
      },
    });

    if (!res.ok) {
      const err = new Error("Failed to fetch current user");
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    // Backends can return either `{ success: true, user }` or the user object directly.
    const nextUser = data?.user ?? (data && typeof data === "object" && "id" in data ? data : null);
    if (!nextUser) return null;

    setUser((prev) => {
      const merged = { ...(prev || {}), ...nextUser };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(merged));
      return merged;
    });

    return nextUser;
  };

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const rawUser = localStorage.getItem(STORAGE_USER_KEY);

    if (token) {
      setToken(token);
      if (rawUser) {
        try {
          setUser(JSON.parse(rawUser));
        } catch {
          localStorage.removeItem(STORAGE_USER_KEY);
          setUser(null);
        }
      }

      (async () => {
        try {
          await refreshUser(token);
        } catch (e) {
          // Token is invalid/expired; clear local auth state.
          localStorage.removeItem(STORAGE_TOKEN_KEY);
          localStorage.removeItem(STORAGE_USER_KEY);
          setUser(null);
          setToken(null);
        } finally {
          setIsLoading(false);
        }
      })();

      return;
    }

    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    if (!token) {
      throw new Error("token is required");
    }

    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setToken(token);

    // Upgrade to the DB-backed user profile (name, language, timezone, etc.).
    refreshUser(token).catch(() => {});
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
