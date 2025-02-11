import { Request, Response } from "express";
import { Leaderboard } from "../models/leaderboard.model";

/**
 * Creates a `ILeaderboard` in the database
 * Validation checks aren't needed here as I'm using Mongoose
 * for schema validation
 * @param req The request
 * @param res The response
 * @returns
 */
const create = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;

  try {
    // We only want one leaderboard, so find any (by {}) and replace
    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html#upsert
    const leaderboard = await Leaderboard.findOneAndReplace({}, data, {
      upsert: true,
    });
    res.status(200).send({ data: leaderboard });
  } catch (error) {
    console.error(`Error attempting to create leaderboard: ${error}`);
    res.status(400).send("Bad leaderboard data.");
  }
};

/**
 * Fetches the leaderboard from the database
 * @param _
 * @param res The response
 */
const read = async (_: any, res: Response): Promise<void> => {
  try {
    const leaderboard = await Leaderboard.findOne({});
    res.status(200).send({ data: leaderboard });
  } catch (error) {
    console.error(`Error attempting to fetch leadboard: ${error}`);
    res.status(400).send({ data: {}, status: "fail", code: 400 });
  }
};

export { create, read };
