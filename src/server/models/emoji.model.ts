import { Schema, model } from "mongoose";
import { IEmoji } from "../../shared/types/leaderboard.interface";

export const emojiSchema = new Schema<IEmoji>(
  {
    id: { type: String },
    name: { type: String },
  },
  { _id: false },
);

export const Emoji = model<IEmoji>("Emoji", emojiSchema);
