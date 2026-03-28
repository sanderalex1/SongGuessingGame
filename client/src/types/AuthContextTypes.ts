import type { ReactNode } from "react";
import type { User } from "./types";

export type AuthProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  static: {
    user: User | null;
    token: string | null;
    error: string | null;
    isLoading: boolean;
  };
  action: {
    register: (
      username: string,
      email: string,
      password: string,
    ) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    guestLogin: (username: string) => Promise<void>;
    logout: () => void;
  };
};
