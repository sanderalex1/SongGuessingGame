import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { AuthContextType, AuthProviderProps, User } from "../types";
import * as api from "../api/authAPI";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const newUser = await api.createUser(username, email, password);
      setUser(newUser.user);
      setToken(newUser.token);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await api.loginUser(email, password);
      setUser(user.user);
      setToken(user.token);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };
  const guestLogin = async (username: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const guest = await api.createGuest(username);
      setUser(guest.user);
      setToken(guest.token);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    static: {
      user,
      token,
      error,
      isLoading,
    },
    action: {
      register,
      login,
      guestLogin,
      logout,
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
