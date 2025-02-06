import { Schema, model } from "mongoose";
import { memberSchema } from "./member.model";
import { IMessage } from "../../shared/types/leaderboard.interface";

export const messageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  author: { type: memberSchema, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  url: { type: String, required: true },
});

export const Message = model<IMessage>("Message", messageSchema);
