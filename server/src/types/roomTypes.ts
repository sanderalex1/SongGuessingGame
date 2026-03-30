export type player = {
  userId: string;
  username: string;
};

export type settings = {
  rounds: number;
  clipDuration: number;
};

export const GameStatusEnum = ["waiting", "playing", "finished"] as const;

export type GameStatus = (typeof GameStatusEnum)[number];

export type Room = {
  code: string;
  hostId: string;
  players: player[];
  settings: settings;
  status: GameStatus;
};
