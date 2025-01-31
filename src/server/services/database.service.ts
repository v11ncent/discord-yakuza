import * as mongoDB from "mongodb";
import { environmentVariables } from "../helpers";

export const collections: { users?: mongoDB.Collection } = {};

export async function connectToDatabase() {
  const { connection, database, collection } = environmentVariables();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(connection);
  await client.connect();

  const db: mongoDB.Db = client.db(database);
  const usersCollection: mongoDB.Collection = db.collection(collection);
  collections.users = usersCollection;
  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`,
  );
}
