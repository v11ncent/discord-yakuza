import * as dotenv from "dotenv";

type EnvironmentVariables = {
  connection: string;
  database: string;
  collection: string;
};

/**
 * Validates and stores relevant environment variables
 * @returns An object of environment variables
 */
export const environmentVariables = (): EnvironmentVariables => {
  dotenv.config();
  const connection = process.env["MONGO_DB_CONNECTION_STRING"];
  const database = process.env["MONGO_DB_NAME"];
  const collection = process.env["MONGO_COLLECTION_NAME"];

  // We'll eventually need to make this more sophisticated if
  // we add anymore env variables
  if (!connection || !database || !collection) {
    throw new Error("Not all .env variables are initialized.");
  }

  const variables = {
    connection,
    database,
    collection,
  };

  return variables;
};
