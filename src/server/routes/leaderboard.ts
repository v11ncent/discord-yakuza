import { Router } from "express";
import { create, read } from "../controllers/leaderboard";

const router = Router();
router.post("/", create);
router.get("/", read);

export { router as leaderboardRouter };
