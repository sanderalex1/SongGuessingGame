import type { Server } from "socket.io";
import * as songService from "../services/song.js";
import type { Song } from "../types/gameEngineTypes.js";
import type { player, settings } from "../types/roomTypes.js";
import { calculateScore } from "../utils/scoring.js";

/**
 * Fetch a fresh preview URL from the Deezer API for a given track.
 * Falls back to the stored (possibly expired) URL on failure.
 */
async function freshPreviewUrl(song: Song): Promise<string> {
  if (!song.deezer_id) return song.preview_url;
  try {
    const res = await fetch(`https://api.deezer.com/track/${song.deezer_id}`);
    if (!res.ok) return song.preview_url;
    const data = await res.json();
    return data.preview || song.preview_url;
  } catch {
    return song.preview_url;
  }
}

export class GameEngine {
  private roomCode: string;
  private songs: Song[];
  private freshUrls: Map<number, string>; // roundIndex -> fresh URL
  private players: Map<
    string,
    { score: number; guessedThisRound: boolean; correctGuesses: number }
  >;
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
    this.freshUrls = new Map();
    this.currentRound = 0;
    this.totalRounds = settings.rounds;
    this.clipDuration = settings.clipDuration;
    this.timer = null;
    this.timeLeft = 0;
    this.players = new Map();
    for (const p of playerList) {
      this.players.set(p.userId, {
        score: 0,
        guessedThisRound: false,
        correctGuesses: 0,
      });
    }
  }

  async startGame() {
    this.songs = await songService.getRandomSong(String(this.totalRounds));

    // Pre-fetch fresh Deezer preview URLs for all rounds
    const urlPromises = this.songs.map((song, i) =>
      freshPreviewUrl(song).then((url) => this.freshUrls.set(i, url)),
    );
    await Promise.all(urlPromises);

    this.startRound();
  }

  startRound() {
    const roundNum = ++this.currentRound;
    const songUrl = this.freshUrls.get(this.currentRound - 1) ?? this.songs[this.currentRound - 1]?.preview_url;
    const duration = this.clipDuration;
    this.players.forEach((playerData) => (playerData.guessedThisRound = false));
    this.timeLeft = duration;

    console.log(`[GameEngine] Round ${roundNum} — songUrl: ${songUrl?.substring(0, 80)}...`);

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
  }

  submitGuess(userId: string, guess: string) {
    const playerData = this.players.get(userId);
    if (playerData) {
      const currentSong = this.songs[this.currentRound - 1];

      if (playerData.guessedThisRound === true) return null;

      playerData.guessedThisRound = true;

      const result = calculateScore(
        currentSong?.title ?? "",
        currentSong?.artist ?? "",
        guess,
        this.timeLeft,
        this.clipDuration,
      );

      if (result.points > 0) {
        playerData.score += result.points;
      }
      if (result.accuracy >= 1.0 || result.artistMatch) {
        playerData.correctGuesses++;
      }

      this.io.to(this.roomCode).emit("game:guess-result", {
        userId,
        correct: result.accuracy >= 1.0 || result.artistMatch,
        accuracy: result.accuracy,
        artistMatch: result.artistMatch,
        points: result.points,
      });
    }
    let allGuessed = true;
    this.players.forEach((p) => {
      if (!p.guessedThisRound) allGuessed = false;
    });
    if (allGuessed) this.endRound();
  }

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
  }

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
  }
}
