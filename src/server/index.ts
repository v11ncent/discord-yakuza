import express from "express";
import mongoose from "mongoose";
import { leaderboardRouter } from "./routes/leaderboard";
import { environmentVariables } from "./helpers";

const { connection } = environmentVariables();
const app = express();
const port = 3000;

app.use(express.json()); // Parses and 'unzips' request bodys so we can use
app.use("/leaderboard", leaderboardRouter);

app.listen(port, () => {
  console.log(`Backend connected: Port ${port}`);
  mongoose.connect(connection);
});
