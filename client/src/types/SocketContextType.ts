import type { ReactNode } from "react";
import { Socket } from "socket.io-client";

export type SocketProviderProps = {
  children: ReactNode;
};

export type OnlineUser = {
  userId: string;
  username: string;
};

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: OnlineUser[];
};
