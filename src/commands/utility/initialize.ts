// Fetches all messages & stores data in database
import {
  SlashCommandBuilder,
  CommandInteraction,
  Guild,
  ChannelType,
  TextChannel,
} from "discord.js";
import { isInteractionAllowed } from "../helpers/index";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initialize")
    .setDescription("Fetches & stores message data in the database."),

  async execute(interaction: CommandInteraction) {
    const guild = interaction.guild;

    if (isInteractionAllowed(interaction) && guild) {
      // Defer reply since getAllGuildMessages() takes longer than 3 seconds,
      // see: https://discordjs.guide/slash-commands/response-methods.html#editing-responses
      await interaction.deferReply({ ephemeral: true });
      getAllGuildMessages(guild).then(async () => {
        await interaction.editReply("Initialization completed !!");
      });
    } else {
      await interaction.reply({
        content: "You can't run this command unless you're an admin 🤭",
        ephemeral: true,
      });
    }
  },
};

const getAllGuildMessages = async (guild: Guild) => {
  const channels = await getAllGuildTextChannels(guild);
  const channel = channels.values().next().value;

  if (channel) await getAllMessagesFromChannel(channel);
};

// Get all messages in a channel
// https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
const getAllMessagesFromChannel = async (channel: TextChannel) => {
  let pack = await channel.messages.fetch({ limit: 100 });
  let pivot = pack.last();
  let messages = [...pack.values()];

  console.log(
    `Getting all messages from ${channel.name}: ${messages.length} / 1000...`,
  );

  while (pivot !== undefined && messages.length < 10000) {
    pack = await channel.messages.fetch({
      limit: 100,
      before: pivot.id,
    });

    pivot = pack.last();
    messages = [...messages, ...pack.values()];
    console.log(
      `Getting all messages from ${channel.name}: ${messages.length} / 1000...`,
    );
  }

  console.log(`${channel.name} channel message fetch operation finished.`);
  return messages;
};

const getAllGuildTextChannels = async (guild: Guild) => {
  return guild.channels.cache.filter(
    (channel) => channel !== null && channel.type === ChannelType.GuildText,
  );
};
