import { Router } from "express";
import { allSongs, randomSong } from "../controllers/song.js";
const songRouter = Router();

songRouter.get("/songs", allSongs);
songRouter.get("/songs/random", randomSong);

export default songRouter;
