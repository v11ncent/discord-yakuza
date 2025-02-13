import { Schema, model } from "mongoose";
import { ILeaderboard } from "../../shared/types/leaderboard.interface";
import { rankingSchema } from "./ranking.model";

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    rankings: { type: [rankingSchema], required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { _id: false },
);

export const Leaderboard = model<ILeaderboard>(
  "Leaderboard",
  leaderboardSchema,
);
