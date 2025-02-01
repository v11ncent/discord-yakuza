import {
  CommandInteraction,
  Guild,
  TextChannel,
  Message,
  EmbedBuilder,
  MessageFlags,
  MessageReaction,
} from "discord.js";
import {
  isBotMessage,
  isInteractionAllowed,
  isTextMessage,
  getAllGuildTextChannels,
} from "../helpers/index";
import {
  IMember,
  IMessage,
  IRanking,
  IReaction,
} from "../../shared/types/leaderboard.interface";

export const initialize = async (interaction: CommandInteraction) => {
  if (isInteractionAllowed(interaction) && interaction.guild) {
    // see: https://discordjs.guide/slash-commands/response-methods.html#editing-responses
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const leaderboard = await initializeLeaderboard(interaction.guild);

    if (!leaderboard) {
      console.error("Leaderboard is empty.");
      interaction.editReply(
        "Leaderboard was not able to be initialized. Please check logs.",
      );
      return;
    }

    // Create a custom EmbedBuilder in `helpers` eventually
    const embed = new EmbedBuilder()
      .setTitle("Yakuza Leaderboard")
      .setURL("https://discordumpire.com")
      .setThumbnail(
        "https://encycolorpedia.com/emojis/chart-increasing-with-yen.png",
      )
      .setTimestamp()
      .setColor("#77b255");

    leaderboard?.slice(0, 5).forEach((ranking, index) => {
      embed.addFields({
        name: `**Rank: #${++index}**`,
        value: `
        **${ranking.member}**: ${ranking.message.content}
        Yakuzas: ${ranking.count} — ${ranking.message.url}
        `,
      });
    });

    await interaction.editReply({ embeds: [embed] });
  } else {
    await interaction.reply({
      content: "You can't run this command unless you're an admin 🤭",
      flags: MessageFlags.Ephemeral,
    });
  }
};

/**
 * Create leaderboard with top rated messages
 * @returns A leadboard of `Ranking`
 */
const initializeLeaderboard = async (
  guild: Guild,
): Promise<IRanking[] | []> => {
  const leaderboard: IRanking[] = [];
  const messages = await getAllGuildMessages(guild);

  if (!messages) return [];

  messages.forEach((message) => {
    const transformed = mutateMessage(message);
    const reaction = getMessageReaction(message);

    leaderboard.push({
      member: mutateMember(message),
      message: transformed,
      count: reaction.count,
    });
  });

  leaderboard.sort((a, b) => b.count - a.count);
  return leaderboard;
};

const mutateMember = (message: Message): IMember => {
  return {
    id: message.author.id,
    username: message.author.username,
    avatar: message.author.avatar,
  };
};

const mutateMessage = (message: Message): IMessage => {
  return {
    id: message.id,
    author: mutateMember(message),
    content: message.content,
    reaction: mutateReaction(getMessageReaction(message)),
    date: message.createdAt,
    url: message.url,
  };
};

const mutateReaction = (reaction: MessageReaction): IReaction => {
  const id = reaction.emoji.id;
  const name = reaction.emoji.id;
  const count = reaction.count;

  return { id, name, count };
};

/**
 * Get specific reaction on a message
 * @param message A text message
 * @param filter The name of the reaction or emoji to filter for
 * @returns A specific reaction or null if one isn't found
 */
const getMessageReaction = (
  message: Message,
  filter: string = "💹",
): MessageReaction | null => {
  const [...all] = message.reactions.cache.values();

  const find = all.filter((reaction) => {
    const name = reaction.emoji.name ?? "";
    return filter.includes(name);
  });

  return find.pop() ?? null;
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
 * @returns An array of Messages that are written by a user, contain text, and have a specific reaction
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
    return (
      isTextMessage(message) &&
      !isBotMessage(message) &&
      !!getMessageReaction(message) // If message contains specified reaction
    );
  });
};
