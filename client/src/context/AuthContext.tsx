import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  loginAsGuest: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    setUser({ id: crypto.randomUUID(), username: email.split('@')[0], email, isGuest: false });
  };

  const register = (username: string, email: string, _password: string) => {
    setUser({ id: crypto.randomUUID(), username, email, isGuest: false });
  };

  const loginAsGuest = (username: string) => {
    setUser({ id: crypto.randomUUID(), username, isGuest: true });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
