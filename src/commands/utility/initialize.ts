// Fetches all messages & stores data in database
import {
  SlashCommandBuilder,
  CommandInteraction,
  Guild,
  ChannelType,
  TextChannel,
  Message,
  User,
} from "discord.js";
import { isInteractionAllowed } from "../helpers/index";

type Ranking = {
  member: User;
  message: Message;
  count: number;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initialize")
    .setDescription("Fetches & stores message data in the database."),

  async execute(interaction: CommandInteraction) {
    if (isInteractionAllowed(interaction) && interaction.guild) {
      // see: https://discordjs.guide/slash-commands/response-methods.html#editing-responses
      await interaction.deferReply({ ephemeral: true });
      const leaderboard = await initializeLeaderboard(interaction.guild);
      await interaction.editReply(`Leaderboard initialized: ${leaderboard}`);
    } else {
      await interaction.reply({
        content: "You can't run this command unless you're an admin 🤭",
        ephemeral: true,
      });
    }
  },
};

/**
 * Create leaderboard with top rated messages
 * @returns A leadboard of `Ranking`
 */
const initializeLeaderboard = async (guild: Guild) => {
  const leaderboard: Ranking[] = [];
  const messages = await getAllGuildMessages(guild);

  console.log("Messages: " + messages.splice(0, 3));

  if (messages) {
    // messages.forEach((message) => {
    //   leaderboard.push({
    //     member: message.author,
    //     message: message,
    //     count: getMessageReactionCount(message),
    //   });
    // });

    // leaderboard.sort((a, b) => b.count - a.count);
    return leaderboard;
  }

  console.error("Error initializing leaderboard: `messages` is null.");
  return null;
};

/**
 * Get all messages from every `TextChannel` in a `Guild`
 * @param guild A `Guild`
 */
const getAllGuildMessages = async (guild: Guild) => {
  const channels = await getAllGuildTextChannels(guild);

  if (channels) {
    // Using `Promise.all()` here so that we get an array of data rather than promises
    const messages = await Promise.all(channels.map(getAllChannelMessages));
    return messages.flat();
  }

  console.error("Error fetching guild messages");
  return [];
};

/**
 * Gets all `TextChannel` in a `Guild`
 * @param guild A `Guild`
 * @returns A Collection of `TextChannel`
 */
const getAllGuildTextChannels = async (guild: Guild) => {
  return guild.channels.cache.filter(
    (channel) => channel !== null && channel.type === ChannelType.GuildText,
  );
};

/**
 * Get all messages from a `TextChannel`
 * https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
 * @param channel A `TextChannel`
 * @returns An array of `Message`
 */
const getAllChannelMessages = async (
  channel: TextChannel,
): Promise<Message[]> => {
  let messages = await getQualifyingMessages(channel);
  let pivot = messages.pop()?.id;

  while (pivot !== undefined && messages.length < 100) {
    let batch = await getQualifyingMessages(channel, pivot);
    messages = [...messages, ...batch];
    pivot = batch.pop()?.id;
  }

  return messages;
};

/**
 * Filters an array of messages
 * @param messages An array of `Message`
 * @param pivot
 * @returns An array of `Message` that are written by a user and contain text
 */
const getQualifyingMessages = async (
  channel: TextChannel,
  pivot?: string,
): Promise<Message[]> => {
  const batch = await channel.messages.fetch({
    limit: 100,
    ...(pivot && { before: pivot }), // Cool! Using spread to optionally include
  });
  let messages = Array.from(batch.values());

  return messages.filter((message) => {
    return isTextMessage(message) && !isBotMessage(message);
  });
};

/**
 * Determines if `Message` author was a bot
 * @param message A `Message`
 * @returns `boolean`
 */
const isBotMessage = (message: Message): boolean => {
  return message.author.bot;
};

/**
 * Determines if `Message` contains text.
 * @param message
 * @returns `boolean`
 */
const isTextMessage = (message: Message): boolean => {
  return message.content !== "";
};

/**
 * Get specific reaction counts on a message
 * @param message A text message
 * @param filter A list of reactions to filter
 * @returns A `number` of filtered reactions
 */
// const getMessageReactionCount = (
//   message: Message,
//   filter: string[] = ["💹"],
// ) => {
//   const [...all] = message.reactions.cache.values();

//   const find = all.filter((reaction) => {
//     const name = reaction.emoji.name ?? "";
//     return filter.includes(name);
//   });

//   return find[0]?.count ?? 0;
// };
