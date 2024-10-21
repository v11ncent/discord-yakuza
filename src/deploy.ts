import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const commands: any = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const rest = new REST().setToken(process.env["BOT_TOKEN"]!);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  `Please input the guild ID to deploy bot commands to: `,
  async (guildId) => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      const data: any = await rest.put(
        Routes.applicationGuildCommands(process.env["CLIENT_ID"]!, guildId),
        { body: commands },
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }

    rl.close();
  },
);
