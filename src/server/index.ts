import express from "express";
import * as dotenv from "dotenv";
import { connectToDatabase } from "./services/database.service";
import { usersRouter } from "./routes/user.router";

dotenv.config();
const app = express();
const port = process.env["EXPRESS_PORT"] ?? 3000;
const usersRoute = process.env["USERS_ROUTE"] ?? "/users";

connectToDatabase()
  .then(() => {
    app.use(usersRoute, usersRouter);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}.`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed.", error);
    process.exit();
  });
