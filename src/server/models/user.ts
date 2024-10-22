// https://www.mongodb.com/resources/products/compatibilities/using-typescript-with-mongodb-tutorial
import { ObjectId } from "mongodb";

type Emoji = {
  name: string;
  count: number;
};

export default class User {
  constructor(
    public server: string,
    public username: string,
    public emojis: Emoji[],
    public id?: ObjectId,
  ) {}
}
