import type { player, Room, settings } from "../types/roomTypes.js";

const rooms = new Map<string, Room>();

//returns a string like "ABC123"
function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

//returns room with defalut seettings and status waiting
export const createRoom = (hostId: string, username: string): Room => {
  const defaultSettings: settings = { rounds: 5, clipDuration: 15 };
  const player: player = {
    userId: hostId,
    username: username,
  };

  const room = {
    code: generateCode(),
    hostId: hostId,
    players: [player],
    settings: defaultSettings,
    status: "waiting" as const,
  };

  rooms.set(room.code, room);
  return room;
};

//returns room with a new player
export const joinRoom = (code: string, userId: string, username: string) => {
  if (!rooms.has(code)) return null;
  const player: player = {
    userId: userId,
    username: username,
  };
  const room = rooms.get(code);
  room?.players.push(player);
  return room;
};

//returns room with updated players list or deletes it if no players left and returns null
export const leaveRoom = (code: string, userId: string) => {
  const room = rooms.get(code);
  if (!room) return null;

  room.players = room.players.filter((player) => player.userId !== userId);

  if (room.players.length === 0) {
    rooms.delete(code);
    return null;
  } else {
    return room;
  }
};

/** returns room object like:
{
  code: "ABC123",
  hostId: "user-uuid",
  players: [{ userId: "...", username: "..." }, ...],
  settings: { rounds: 5, clipDuration: 15 },
  status: "waiting"  // waiting | playing | finished
}
  
**/
export const getRoom = (code: string) => {
  const room = rooms.get(code);
  return room;
};

export const getAllRooms = () => {
  const allRooms = Array.from(rooms.values());
  const waitingRooms = allRooms.filter((room) => room.status === "waiting");
  return waitingRooms;
};
