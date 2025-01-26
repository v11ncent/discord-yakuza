// Fetches all messages & stores data in database
import {
  SlashCommandBuilder,
  CommandInteraction,
  TextChannel,
  Message,
} from "discord.js";
import { isInteractionAllowed, isGuildTextChannel } from "../helpers/index";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initialize")
    .setDescription("Fetches & stores message data in the database."),

  async execute(interaction: CommandInteraction) {
    const channel = interaction.channel;

    if (isInteractionAllowed(interaction) && isGuildTextChannel(channel)) {
      const messages = await getAllMessages(channel);
      await interaction.reply(messages.toString().substring(0, 100));
    } else {
      await interaction.reply({
        content: "You can't run this command unless you're an admin 🤭",
        ephemeral: true,
      });
    }
  },
};

// https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
const getAllMessages = async (
  channel: TextChannel,
  limit: number = 100,
): Promise<Message[]> => {
  const shipment: Message[] = [];
  const manager = channel.messages;
  let pivot = null;

  while (shipment.length < limit) {
    const parts: any = await manager.fetch({
      limit: limit < 100 ? limit : 100, // Max messages per call is 100
      before: pivot?.id,
    });

    pivot = parts.last(); // Move the pointer to the last message fetched
    parts.forEach((part: any) => shipment.push(part));
  }

  return shipment;
};
