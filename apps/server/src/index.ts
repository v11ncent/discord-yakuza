import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { leaderboardRouter } from "./routes/leaderboard";
import { environmentVariables } from "./helpers";

const { connection } = environmentVariables();
const app = express();
const port = 3000;

app.use(cors());
// Parses and unzips request body so we can use
// Backend can *only* accept json now, so set content headers as such
app.use(express.json());
app.use("/leaderboard", leaderboardRouter);

app.listen(port, () => {
  console.log(`Backend connected: Port ${port}`);
  mongoose.connect(connection);
});