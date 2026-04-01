import "dotenv/config";
import pool from "./pool.js";

const ARTISTS = [
  { artist: "Queen", difficulty: "easy" },
  { artist: "Joji", difficulty: "medium" },
  { artist: "The Beatles", difficulty: "easy" },
  { artist: "The Weeknd", difficulty: "easy" },
  { artist: "Post Malone", difficulty: "medium" },
];

const seedSongs = async () => {
  for (const artist of ARTISTS) {
    const response = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(artist.artist)}`,
    );
    const data = await response.json();

    for (const song of data.data.slice(0, 5)) {
      await pool.query(
        `INSERT INTO songs (id, title, artist, preview_url, difficulty, deezer_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          crypto.randomUUID(),
          song.title,
          artist.artist,
          song.preview,
          artist.difficulty,
          song.id,
        ],
      );
    }
    console.log(`Seeded ${artist.artist}`);
  }
  console.log("Done!");
  process.exit(0);
};

seedSongs();
