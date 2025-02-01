import { Schema, model } from "mongoose";
import { memberSchema } from "./member.model";
import { messageSchema } from "./message.model";
import { IRanking } from "../../shared/types/leaderboard.interface";

export const rankingSchema = new Schema<IRanking>({
  member: { type: memberSchema, required: true },
  message: { type: messageSchema, required: true },
  count: { type: Number, required: true }, // May want to rework this to take a list of `Reaction`
});

export const Ranking = model<IRanking>("Ranking", rankingSchema);
