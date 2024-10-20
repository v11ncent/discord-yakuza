import { Client, Events, GatewayIntentBits } from "discord.js";

const BOT_TOKEN = process.env["BOT_TOKEN"];
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(BOT_TOKEN);
