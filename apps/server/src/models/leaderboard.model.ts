import { Schema, model } from "mongoose";
import { rankingSchema } from "./ranking.model";
import { ILeaderboard } from "@yakuza/types/leaderboard.interface";

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    rankings: { type: [rankingSchema], required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { _id: false }
);

export const Leaderboard = model<ILeaderboard>(
  "Leaderboard",
  leaderboardSchema
);
