import { Schema, model } from "mongoose";
import { IReaction } from "../../shared/types/leaderboard.interface";

export const reactionSchema = new Schema<IReaction>({
  id: { type: String },
  name: { type: String },
  count: { type: Number, required: true },
});

export const Reaction = model<IReaction>("Reaction", reactionSchema);
