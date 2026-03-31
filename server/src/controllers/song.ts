import { asyncHandler } from "../middleware/asyncHandler.js";
import * as songService from "../services/song.js";

export const allSongs = asyncHandler(async (req, res) => {
  const result = await songService.getAllSongs();
  return res.status(200).json(result);
});

export const randomSong = asyncHandler(async (req, res) => {
  const count = (req.query.count as string) || "10";
  const result = await songService.getRandomSong(count);
  return res.status(200).json(result);
});
