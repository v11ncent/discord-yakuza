import { Request, Response } from "express";
import { ILeaderboard } from "../../shared/types/leaderboard.interface";

const create = async (req: Request, res: Response): Promise<void> => {
  const leaderboard = req.body;

  if (!leaderboard || !isLeaderboard(leaderboard)) {
    res.status(400).send("Bad leaderboard data.");
    return;
  }

  console.log(leaderboard);
  res.status(200).send(leaderboard);
};

// Checks at runtime rather than compile time
// Look into zod for better runtime validation as a refactor option
const isLeaderboard = (leaderboard: ILeaderboard): boolean => {
  const rankings = leaderboard.rankings;
  const createdAt = leaderboard.createdAt;
  const updatedAt = leaderboard.updatedAt;

  // Can get crazy and check all the types of the rankings property
  if (!Array.isArray(rankings)) return false;
  if (typeof createdAt !== "string") return false;
  if (typeof updatedAt !== "string") return false;

  return true;
};

export { create };
