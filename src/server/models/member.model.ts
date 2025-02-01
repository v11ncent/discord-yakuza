import { Schema, model } from "mongoose";
import { IMember } from "../../shared/types/leaderboard.interface";

export const memberSchema = new Schema<IMember>({
  id: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String, required: true },
});

export const Member = model<IMember>("Member", memberSchema);
