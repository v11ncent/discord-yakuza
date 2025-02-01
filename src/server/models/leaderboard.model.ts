import { Schema, model } from "mongoose";
import { ILeaderboard } from "../../shared/types/leaderboard.interface";

const leaderboardSchema = new Schema<ILeaderboard>({});
