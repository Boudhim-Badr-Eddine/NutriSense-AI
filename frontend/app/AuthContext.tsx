"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getProfile, login, register } from "../lib/auth";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "authToken";

/**
 * WHY: Encapsulate auth state and token persistence for the app.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveToken = useCallback((newToken: string | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (newToken) {
      window.localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }

    setToken(newToken);
  }, []);

  const handleGetProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profileResponse = await getProfile();
      setUser(profileResponse.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await login(email, password);
        saveToken(response.data.token);
        setUser(response.data.user);
      } finally {
        setIsLoading(false);
      }
    },
    [saveToken],
  );

  const handleRegister = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      try {
        const response = await register(email, password, name);
        saveToken(response.data.token);
        setUser(response.data.user);
      } finally {
        setIsLoading(false);
      }
    },
    [saveToken],
  );

  const handleLogout = useCallback(() => {
    saveToken(null);
    setUser(null);
  }, [saveToken]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      handleGetProfile().catch(() => {
        handleLogout();
      });
    } else {
      setIsLoading(false);
    }
  }, [handleGetProfile, handleLogout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      getProfile: handleGetProfile,
    }),
    [
      user,
      token,
      isLoading,
      handleLogin,
      handleRegister,
      handleLogout,
      handleGetProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
