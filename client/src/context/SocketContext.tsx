import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { SocketContextType, SocketProviderProps } from "../types";
import { useAuthContext } from "./AuthContext";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const {
    static: { token },
  } = useAuthContext();
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (token !== null) {
      socket.current = io("http://localhost:3000", { auth: { token } });
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
    return () => {
      socket.current?.disconnect();
    };
  }, [token]);

  const value: SocketContextType = { socket: socket.current, isConnected };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
