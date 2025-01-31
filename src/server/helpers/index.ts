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
  const variables = {
    connection: process.env["MONGO_DB_CONNECTION_STRING"] ?? "",
    database: process.env["MONGO_DB_NAME"] ?? "",
    collection: process.env["MONGO_COLLECTION_NAME"] ?? "",
  };

  return variables;
};

// Get this to work . . .
// const validateEnvironmentVariables = (
//   variables: EnvironmentVariables,
// ): EnvironmentVariables => {
//   for (const [key, value] of Object.entries(variables)) {
//     if (value === undefined) {
//       throw new Error(`${key} environment variable is undefined.`);
//     }
//   }

//   return variables;
// };
