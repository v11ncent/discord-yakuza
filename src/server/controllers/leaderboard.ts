import { Request, Response } from "express";
// import { ILeaderboard } from "../../shared/types/leaderboard.interface";

const create = async (req: Request, res: Response): Promise<void> => {
  const leaderboard = req.body;
  console.log("Request body: " + JSON.stringify(leaderboard));
  res.status(400).send("Hi");

  // if (!leaderboard || !isLeaderboardType(leaderboard)) {
  //   res.status(400).send("Bad leaderboard data.");
  //   return;
  // }
};

// Checks at runtime rather than compile time
// const isLeaderboardType = (leaderboard: ILeaderboard): boolean => {
//   // Can get crazy and check all the types of the rankings property
//   if (!Array.isArray(leaderboard.rankings)) {
//     return false;
//   }

//   if (!(leaderboard.createdAt instanceof Date)) {
//     return false;
//   }

//   if (!(leaderboard.updatedAt instanceof Date)) {
//     return false;
//   }

//   return true;
// };

export { create };
