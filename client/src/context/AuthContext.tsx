import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthContextType, AuthProviderProps } from '../types/AuthContextTypes';
import type { User } from '../types/types';
import { createUser, loginUser, createGuest, refreshToken as refreshTokenAPI } from '../api/authAPI';

const AUTH_STORAGE_KEY = 'sg_auth';

function loadAuth(): { user: User; token: string; refreshToken: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveAuth(user: User, token: string, refreshToken: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token, refreshToken }));
}

function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

export const useAuth = useAuthContext;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const stored = loadAuth();
  const [user, setUser] = useState<User | null>(stored?.user ?? null);
  const [token, setToken] = useState<string | null>(stored?.token ?? null);
  const [rToken, setRToken] = useState<string | null>(stored?.refreshToken ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Persist whenever auth state changes
  useEffect(() => {
    if (user && token && rToken) {
      saveAuth(user, token, rToken);
    }
  }, [user, token, rToken]);

  // Auto-refresh access token every 6 minutes (token lives 7min)
  const doRefresh = useCallback(async () => {
    if (!rToken) return;
    try {
      const data = await refreshTokenAPI(rToken);
      setToken(data.accessToken);
      setRToken(data.refreshToken);
    } catch {
      // Refresh failed — session expired
      setUser(null);
      setToken(null);
      setRToken(null);
      clearAuth();
    }
  }, [rToken]);

  useEffect(() => {
    if (!rToken) return;
    const id = setInterval(doRefresh, 6 * 60 * 1000); // refresh every 6 min
    return () => clearInterval(id);
  }, [rToken, doRefresh]);

  const handleAuthSuccess = (data: { user: User; token: string; refreshToken: string }) => {
    setUser(data.user);
    setToken(data.token);
    setRToken(data.refreshToken);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      handleAuthSuccess(data);
    } catch (e: any) {
      setError(e.message ?? 'Login failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await createUser(username, email, password);
      handleAuthSuccess(data);
    } catch (e: any) {
      setError(e.message ?? 'Registration failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = async (username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await createGuest(username);
      handleAuthSuccess(data);
    } catch (e: any) {
      setError(e.message ?? 'Guest login failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRToken(null);
    clearAuth();
  };

  const value: AuthContextType = {
    static: { user, token, error, isLoading },
    action: { register, login, guestLogin, logout },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
