import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { users?: mongoDB.Collection } = {};
export async function connectToDatabase() {
  dotenv.config();
  const connectionString = process.env["MONGO_DB_CONNECTION_STRING"];
  const databaseName = process.env["MONGO_DB_NAME"];
  const collectionName = process.env["MONGO_COLLECTION_NAME"];

  if (!connectionString) {
    throw new Error(
      "Please provide a database connection string in the .env file.",
    );
  }

  if (!databaseName) {
    throw new Error("Please provide a database name in the .env file.");
  }

  if (!collectionName) {
    throw new Error(
      "Please provide a database collection name in the .env file.",
    );
  }

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(connectionString);
  await client.connect();

  const db: mongoDB.Db = client.db(databaseName);
  const usersCollection: mongoDB.Collection = db.collection(collectionName);
  collections.users = usersCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`,
  );
}
