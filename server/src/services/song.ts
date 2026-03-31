import pool from "../db/pool.js";

export const getAllSongs = async () => {
  const result = await pool.query(`SELECT * FROM songs`);
  return result.rows;
};

export const getRandomSong = async (count: string) => {
  const result = await pool.query(
    `SELECT * FROM songs ORDER BY RANDOM() LIMIT $1`,
    [count],
  );
  return result.rows;
};
