// https://www.mongodb.com/resources/products/compatibilities/using-typescript-with-mongodb-tutorial
import { ObjectId } from "mongodb";

type Reaction = {
  name: string;
  count: number;
};

export default class User {
  constructor(
    public server: string,
    public username: string,
    public reaction: Reaction[],
    public id?: ObjectId,
  ) {}
}
