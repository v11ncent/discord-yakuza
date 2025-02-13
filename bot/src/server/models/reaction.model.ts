import { Schema, model } from "mongoose";
import { emojiSchema } from "./emoji.model";
import { IReaction } from "../../shared/types/leaderboard.interface";

export const reactionSchema = new Schema<IReaction>(
  {
    emoji: { type: emojiSchema, required: true },
    count: { type: Number, required: true },
  },
  { _id: false },
);

export const Emoji = model<IReaction>("Reaction", reactionSchema);
