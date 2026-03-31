import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocket } from "./socket/socketHandler.js";
const PORT: number = 3000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
