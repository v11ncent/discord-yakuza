import { Schema, model } from "mongoose";
import { IMember } from "../../shared/types/leaderboard.interface";

export const memberSchema = new Schema<IMember>(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  { _id: false },
);

export const Member = model<IMember>("Member", memberSchema);
