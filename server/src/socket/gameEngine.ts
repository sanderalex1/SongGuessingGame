import type { Server } from "socket.io";
import * as songService from "../services/song.js";
import type { Song } from "../types/gameEngineTypes.js";
import type { player, settings } from "../types/roomTypes.js";

export class GameEngine {
  private roomCode: string;
  private songs: Song[]; // fetched from DB at start
  private players: Map<string, { score: number; guessedThisRound: boolean }>;
  private currentRound: number;
  private totalRounds: number;
  private clipDuration: number;
  private timer: NodeJS.Timeout | null;
  private timeLeft: number;
  private io: Server;

  constructor(
    io: Server,
    roomCode: string,
    playerList: player[],
    settings: settings,
  ) {
    this.io = io;
    this.roomCode = roomCode;
    this.songs = [];
    this.currentRound = 0;
    this.totalRounds = settings.rounds;
    this.clipDuration = settings.clipDuration;
    this.timer = null;
    this.timeLeft = 0;
    this.players = new Map();
    for (const p of playerList) {
      this.players.set(p.userId, { score: 0, guessedThisRound: false });
    }
  }

  async startGame() {
    this.songs = await songService.getRandomSong(String(this.totalRounds));
    this.startRound();
  } // fetch songs, call startRound

  startRound() {
    const roundNum = ++this.currentRound;
    const currentSong = this.songs[this.currentRound - 1];
    const songUrl = currentSong?.preview_url;
    const duration = this.clipDuration;
    this.players.forEach((playerData) => (playerData.guessedThisRound = false));
    this.timeLeft = duration;
    this.io
      .to(this.roomCode)
      .emit("game:round-start", { roundNum, songUrl, duration });

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.io.to(this.roomCode).emit("game:timer-tick", this.timeLeft);

      if (this.timeLeft <= 0) {
        clearInterval(this.timer!);
        this.endRound();
      }
    }, 1000);
  } // emit round-start, begin timer

  submitGuess(userId: string, guess: string) {
    const playerData = this.players.get(userId);
    if (playerData) {
      const currentSong = this.songs[this.currentRound - 1];
      const score = Math.round(1000 * (this.timeLeft / this.clipDuration));
      const correctGuess =
        currentSong?.artist.trim().toLowerCase() ===
          guess.trim().toLowerCase() ||
        currentSong?.title.trim().toLowerCase() === guess.trim().toLowerCase();

      if (playerData.guessedThisRound === true) return null;

      playerData.guessedThisRound = true;
      if (correctGuess) {
        playerData.score += score;
      }
      const points = correctGuess ? score : 0;
      this.io
        .to(this.roomCode)
        .emit("game:guess-result", { userId, correct: correctGuess, points });
    }
    let allGuessed = true;
    this.players.forEach((p) => {
      if (!p.guessedThisRound) allGuessed = false;
    });
    if (allGuessed) this.endRound();
  } // validate, score, check if round done

  endRound() {
    clearInterval(this.timer!);
    const currentSong = this.songs[this.currentRound - 1];
    const title = currentSong?.title;
    const artist = currentSong?.artist;

    const scores: { userId: string; score: number }[] = [];
    this.players.forEach((data, userId) => {
      scores.push({ userId, score: data.score });
    });

    this.io
      .to(this.roomCode)
      .emit("game:round-end", { answer: { title, artist }, scores });

    if (this.currentRound >= this.totalRounds) {
      this.endGame();
    } else {
      setTimeout(() => this.startRound(), 3000);
    }
  } // emit round-end, start next or finish

  endGame() {
    const finalScores: { userId: string; score: number }[] = [];
    this.players.forEach((data, userId) => {
      finalScores.push({ userId, score: data.score });
    });
    finalScores.sort((a, b) => b.score - a.score);
    const ranked = finalScores.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
    this.io.to(this.roomCode).emit("game:finished", { finalScores: ranked });
  } // emit finished, save to DB
}
