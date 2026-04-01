import type { Server } from "socket.io";
import * as roomManager from "./roomManager.js";
import { GameEngine } from "./gameEngine.js";

const games = new Map<string, GameEngine>();
const onlineUsers = new Map<string, { userId: string; username: string }>();

function broadcastOnlineUsers(io: Server) {
  const users = Array.from(onlineUsers.values());
  io.emit("users:online", users);
}

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("user:register", (data: { userId: string; username: string }) => {
      onlineUsers.set(socket.id, { userId: data.userId, username: data.username });
      broadcastOnlineUsers(io);
    });

    socket.on("room:create", (data) => {
      const room = roomManager.createRoom(data.id, data.username, data.code, data.settings);

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
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers(io);
    });

    socket.on("game:start", (data) => {
      const lobby = roomManager.getRoom(data.code);

      if (!lobby) return;

      lobby.status = "playing";
      const game = new GameEngine(
        io,
        lobby.code,
        lobby.players,
        lobby.settings,
      );
      games.set(lobby.code, game);
      game.startGame();
    });

    socket.on("game:guess", (data) => {
      const game = games.get(data.code);
      if (!game) return;

      game.submitGuess(data.userId, data.guess);
    });
  });
};
