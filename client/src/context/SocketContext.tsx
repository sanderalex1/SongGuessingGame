import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { SocketContextType, SocketProviderProps, OnlineUser } from "../types";
import { useAuthContext } from "./AuthContext";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocketContext must be used within a SocketProvider");
  return context;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const {
    static: { token, user },
  } = useAuthContext();
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (token !== null && user) {
      const s = io({ auth: { token } });
      socket.current = s;

      s.on("connect", () => {
        setIsConnected(true);
        s.emit("user:register", { userId: user.id, username: user.username });
      });

      s.on("users:online", (users: OnlineUser[]) => {
        setOnlineUsers(users);
      });

      s.on("disconnect", () => {
        setIsConnected(false);
      });
    } else {
      socket.current?.disconnect();
      socket.current = null;
      setIsConnected(false);
      setOnlineUsers([]);
    }
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [token, user]);

  const value: SocketContextType = { socket: socket.current, isConnected, onlineUsers };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
