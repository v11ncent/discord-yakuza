import { Schema, model } from "mongoose";
import { memberSchema } from "./member.model";
import { messageSchema } from "./message.model";
import { reactionSchema } from "./reaction.model";
import { IRanking } from "../../shared/types/leaderboard.interface";

export const rankingSchema = new Schema<IRanking>(
  {
    member: { type: memberSchema, required: true },
    message: { type: messageSchema, required: true },
    reaction: { type: reactionSchema, required: true },
  },
  { _id: false },
);

export const Ranking = model<IRanking>("Ranking", rankingSchema);
