import type { Server } from "socket.io";
import * as roomManager from "./roomManager.js";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("room:create", (data) => {
      const room = roomManager.createRoom(data.id, data.username);

      socket.join(room.code);

      io.to(room.code).emit("room:updated", room);
    });

    socket.on("room:join", (data) => {
      const room = roomManager.joinRoom(data.code, data.id, data.username);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      socket.join(room.code);

      io.to(room.code).emit("room:updated", room);
    });

    socket.on("room:leave", (data) => {
      const room = roomManager.leaveRoom(data.code, data.id);

      socket.leave(data.code);
      if (room) {
        io.to(data.code).emit("room:updated", room);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};
