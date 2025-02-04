import { Router } from "express";
import { create } from "../controllers/leaderboard";

const router = Router();
router.post("/", create);

export { router as leaderboardRouter };
