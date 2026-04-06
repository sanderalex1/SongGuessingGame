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
    try {
      const response = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(artist.artist)}`,
      );
      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        console.warn(`No results from Deezer for "${artist.artist}", skipping`);
        continue;
      }

      // Filter out songs without a preview URL
      const songsWithPreview = data.data.filter(
        (song: any) => song.preview && song.preview.length > 0,
      );

      let seededCount = 0;
      for (const song of songsWithPreview.slice(0, 5)) {
        try {
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
          seededCount++;
        } catch (err) {
          console.warn(`Failed to insert "${song.title}" by ${artist.artist}:`, err);
        }
      }
      console.log(`Seeded ${artist.artist} (${seededCount} songs)`);
    } catch (err) {
      console.error(`Failed to fetch songs for "${artist.artist}":`, err);
    }
  }
  console.log("Done!");
  process.exit(0);
};

seedSongs();
