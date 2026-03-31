import pool from "../db/pool.js";

export const saveGameResults = async (
  roomCode: string,
  hostId: string,
  totalRounds: number,
  results: {
    userId: string;
    score: number;
    correctGuesses: number;
    rank: number;
  }[],
) => {
  // 1. INSERT into game_sessions, get back the session id
  const id = crypto.randomUUID();
  const createdAt = new Date();
  const result = await pool.query(
    `INSERT INTO game_sessions (id, room_code, host_id, rounds, created_at)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [id, roomCode, hostId, totalRounds, createdAt],
  );
  const session = result.rows[0];

  // 2. Loop through results, INSERT each into game_results
  for (const value of results) {
    const id = crypto.randomUUID();
    const gameResult = await pool.query(
      `INSERT INTO game_results (id, session_id, user_id, score, correct_guesses, rank)
        VALUES ($1, $2, $3, $4, $5, $6,)`,
      [
        id,
        session.id,
        value.userId,
        value.score,
        value.correctGuesses,
        value.rank,
      ],
    );

    await pool.query(
      `UPDATE users SET total_score = total_score + $1, games_played = games_played + 1 WHERE id = $2`,
      [value.score, value.userId],
    );
    return gameResult;
  }
  // 3. Update each user's total_score and games_played in users table
};
