import {
  CommandInteraction,
  Message,
  Guild,
  ChannelType,
  MessageReaction,
  User,
  GuildEmoji,
  ApplicationEmoji,
  ReactionEmoji,
  EmbedBuilder,
} from "discord.js";
import { Admins } from "../../shared/enums/admins";
import { Servers } from "../../shared/enums/servers";
import {
  IMember,
  IReaction,
  IMessage,
  IEmoji,
  ILeaderboard,
} from "../../shared/types/leaderboard.interface";

export const postLeaderboard = async (
  leaderboard: ILeaderboard,
): Promise<void> => {
  const endpoint = "http://localhost:3000/leaderboard";
  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leaderboard),
  })
    .then(console.log)
    .catch(console.log);
};

/**
 * Transforms a `User` into an `IMember`
 * @param message A `Message`
 * @returns
 */
export const transformMember = (user: User): IMember => {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
  };
};

/**
 * Transforms a `Message` into an `IMessage` for backend processing
 * @param message A `Message`
 * @param author An `IMember`
 * @param reaction An `IReaction`
 * @returns An `IMessage`
 */
export const transformMessage = (
  message: Message,
  author: IMember,
): IMessage => {
  return {
    id: message.id,
    author: author,
    content: message.content,
    url: message.url,
    date: message.createdAt,
  };
};

/**
 * Transforms a `MessageReaction` into an `IReaction`
 * @param reaction A `MessageReaction`
 * @returns An `IReaction`
 */
export const transformReaction = (reaction: MessageReaction): IReaction => {
  return {
    emoji: transformEmoji(reaction.emoji),
    count: reaction.count,
  };
};

/**
 * Transforms an emoji into an `IEmoji`
 * @param reaction A `MessageReaction`
 * @returns An `IEmoji`
 */
export const transformEmoji = (
  emoji: GuildEmoji | ReactionEmoji | ApplicationEmoji,
): IEmoji => {
  return {
    ...(emoji.id && { id: emoji.id }),
    name: emoji.name,
  };
};

/**
 * Gets all `TextChannel` in a `Guild`
 * @param guild A `Guild`
 * @returns A Collection of `TextChannel`
 */
export const getAllGuildTextChannels = async (guild: Guild) => {
  return guild.channels.cache.filter(
    (channel) => channel !== null && channel.type === ChannelType.GuildText,
  );
};

/**
 * Determines if `Message` author was a bot
 * @param message A `Message`
 * @returns `boolean`
 */
export const isBotMessage = (message: Message): boolean => {
  return message.author.bot;
};

/**
 * Determines if `Message` contains text.
 * @param message
 * @returns `boolean`
 */
export const isTextMessage = (message: Message): boolean => {
  return message.content !== "" && message.embeds.length === 0;
};

/**
 * Checks if member is authorized to call interaction
 * @param interaction The `CommandInteraction` to call
 * @param onlyAdmins Authorize only admins to call the interaction
 * @returns A `boolean`
 */
export const isInteractionAllowed = (
  interaction: CommandInteraction,
  onlyAdmins: boolean = true,
): boolean => {
  if (!interaction.guild) return false;
  if (onlyAdmins) return Object.values(Admins).includes(interaction.user.id);

  return !Object.values(Servers).includes(interaction.guild.id);
};

export const buildLeaderboardEmbed = (
  leaderboard: ILeaderboard,
): EmbedBuilder => {
  const green = "#77b255";
  const embed = new EmbedBuilder()
    .setTitle("Yakuza Leaderboard")
    .setColor(green)
    .setTimestamp(leaderboard.createdAt);

  leaderboard.rankings.forEach((ranking, index) => {
    embed.addFields({
      name: `**Rank: #${++index}**`,
      value: `
      **${ranking.member.username}**: ${ranking.message.content}
      Yakuzas: ${ranking.reaction.count} — ${ranking.message.url}
      `,
    });
  });

  return embed;
};
