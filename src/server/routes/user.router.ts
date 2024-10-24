import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import User from "../models/user";

export const usersRouter = express.Router();
usersRouter.use(express.json());

/*====================*
 *        GETs        /
 *===================*/
usersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    // https://stackoverflow.com/questions/70029584/casting-mongodb-document-to-typescript-interface
    const users = await collections.users?.find<User[]>({}).toArray();

    res.status(200).send(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params["id"];

  try {
    const query = { _id: new ObjectId(id) };
    const user = await collections.users?.findOne<User>(query);

    if (user) {
      res.status(200).send(user);
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching user with id: ${req.params["id"]}`);
  }
});

/*====================*
 *       POSTs        /
 *===================*/
usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;
    const result = await collections.users?.insertOne(newUser);

    if (result) {
      res
        .status(201)
        .send(`Successfully created a new user with id ${result.insertedId}.`);
    } else {
      res.status(500).send("Failed to create a new user.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});

/*====================*
 *        PUTs        /
 *===================*/
usersRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req?.params["id"];

  try {
    const updatedUser: User = req.body as User;
    const query = { _id: new ObjectId(id) };

    const result = await collections.users?.updateOne(query, {
      $set: updatedUser,
    });

    if (result) {
      res.status(200).send(`Successfully updated user with id ${id}.`);
    } else {
      res.status(304).send(`User with id: ${id} not updated.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});

/*====================*
 *      DELETEs       /
 *===================*/
usersRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req?.params["id"];

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed user with id ${id}.`);
    } else if (!result) {
      res.status(400).send(`Failed to remove user with id ${id}.`);
    } else if (!result.deletedCount) {
      res.status(404).send(`User with id ${id} does not exist.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
});
