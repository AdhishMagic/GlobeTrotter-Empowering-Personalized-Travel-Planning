import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(undefined);

const STORAGE_TOKEN_KEY = "authToken";
const STORAGE_USER_KEY = "userData";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const rawUser = localStorage.getItem(STORAGE_USER_KEY);

    if (token && rawUser) {
      try {
        setUser(JSON.parse(rawUser));
        setToken(token);
      } catch {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        setUser(null);
        setToken(null);
      }
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
