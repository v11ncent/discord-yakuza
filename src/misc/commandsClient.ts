import { Client, Collection } from "discord.js";

export class CommandsClient extends Client {
  commands?: Collection<string, unknown>;
}
