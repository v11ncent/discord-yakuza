import { Schema, model } from "mongoose";
import { IEmoji } from "../../shared/types/leaderboard.interface";

export const emojiSchema = new Schema<IEmoji>({
  id: { type: String, required: true },
  name: { type: String, required: true },
});

export const Emoji = model<IEmoji>("Emoji", emojiSchema);
