import {
  CommandInteraction,
  Guild,
  TextChannel,
  Message,
  MessageFlags,
  MessageReaction,
} from "discord.js";
import {
  isBotMessage,
  isInteractionAllowed,
  isTextMessage,
  getAllGuildTextChannels,
  transformReaction,
  transformMember,
  transformMessage,
  buildLeaderboardEmbed,
  postLeaderboard,
} from "../helpers/index";
import { ILeaderboard, IRanking } from "@yakuza/types/leaderboard.interface";

export const initialize = async (interaction: CommandInteraction) => {
  if (!(await isInteractionAllowed(interaction))) return;
  if (!interaction.guild) return;

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const leaderboard = await initializeLeaderboard(interaction.guild);
  const embed = buildLeaderboardEmbed(leaderboard);
  if (embed) await interaction.editReply({ embeds: [embed] });
};

/**
 * Create leaderboard with top rated messages
 * @returns A leadboard of `Ranking`
 */
const initializeLeaderboard = async (guild: Guild): Promise<ILeaderboard> => {
  const rankings: IRanking[] = [];
  const messages = await getAllGuildMessages(guild);

  messages?.forEach((message) => {
    // Can't filter in getQualifyingMessages() without more work
    const reaction = getMessageReaction(message);
    if (!reaction) return;

    const mutatedReaction = transformReaction(reaction);
    const mutatedMember = transformMember(message.author);
    const mutatedMessage = transformMessage(message, mutatedMember);

    rankings.push({
      member: mutatedMember,
      message: mutatedMessage,
      reaction: mutatedReaction,
    });
  });

  rankings.sort((a, b) => b.reaction.count - a.reaction.count);
  const leaderboard = {
    rankings: rankings.slice(0, 25),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await postLeaderboard(leaderboard); // Send to backend
  return leaderboard;
};

/**
 * Get specific reaction on a message
 * @param message A text message
 * @param filter The name of the emoji to filter for
 * @returns A specific emoji or null if one isn't found
 */
const getMessageReaction = (
  message: Message,
  filter: string = "💹"
): MessageReaction | null => {
  // Collections extend Maps so we can use filter() and first()
  // https://discordjs.guide/additional-info/collections.html#array-like-methods
  const reaction = message.reactions.cache.filter((reaction) => {
    return reaction.emoji.name === filter;
  });

  return reaction.first() ?? null;
};

/**
 * Filters an array of messages
 * @param messages An array of `Message`
 * @param pivot
 * @returns An array of Messages that are written by a user and contains text
 */
const getQualifyingMessages = async (
  channel: TextChannel,
  pivot?: string
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
 * Get all messages from every `TextChannel` in a `Guild`
 * @param guild A `Guild`
 */
const getAllGuildMessages = async (guild: Guild) => {
  const channels = await getAllGuildTextChannels(guild);

  if (channels) {
    // Using `Promise.all()` here so we wait for all promises to resolve before returning
    const messages = await Promise.all(channels.map(getAllChannelMessages));
    return messages.flat();
  }

  console.error("Error fetching guild messages");
  return [];
};

/**
 * Get all messages from a `TextChannel`
 * https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
 * @param channel A `TextChannel`
 * @returns An array of `Message`
 */
const getAllChannelMessages = async (
  channel: TextChannel
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
