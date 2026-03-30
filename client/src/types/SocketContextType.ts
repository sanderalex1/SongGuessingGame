import type { ReactNode } from "react";
import { Socket } from "socket.io-client";

export type SocketProviderProps = {
  children: ReactNode;
};

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};
