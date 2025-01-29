// Fetches all messages & stores data in database
import {
  SlashCommandBuilder,
  CommandInteraction,
  Guild,
  ChannelType,
} from "discord.js";
import { isInteractionAllowed } from "../helpers/index";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initialize")
    .setDescription("Fetches & stores message data in the database."),

  async execute(interaction: CommandInteraction) {
    const guild = interaction.guild;

    if (isInteractionAllowed(interaction) && guild) {
      await getAllGuildMessages(guild);
      await interaction.reply("beep boop");
    } else {
      await interaction.reply({
        content: "You can't run this command unless you're an admin 🤭",
        ephemeral: true,
      });
    }
  },
};

// Get all messages in a guild
// https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
const getAllGuildMessages = async (guild: Guild) => {
  const channels = await getAllGuildTextChannels(guild);
  console.log(channels);

  // const shipment: Message[] = [];
  // const manager = channel.messages;
  // let pivot = null;

  // while (shipment.length < limit) {
  //   const parts: any = await manager.fetch({
  //     limit: limit < 100 ? limit : 100, // Max messages per call is 100
  //     before: pivot?.id,
  //   });

  //   pivot = parts.last(); // Move the pointer to the last message fetched
  //   parts.forEach((part: any) => shipment.push(part));
  // }

  // return shipment;
};

const getAllGuildTextChannels = async (guild: Guild) => {
  return guild.channels.cache.filter(
    (channel) => channel !== null && channel.type === ChannelType.GuildText,
  );
};
