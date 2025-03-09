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
  MessageFlags,
} from "discord.js";
import { Admins } from "../../enums/admins";
import { Servers } from "../../enums/servers";
import {
  IMember,
  IReaction,
  IMessage,
  IEmoji,
  ILeaderboard,
} from "@yakuza/types/leaderboard.interface";
import { IApiResponse } from "@yakuza/types/api.interface";

/**
 * Gets stored leaderboard
 * Is not configured to handle multiple guilds
 * @returns A `ILeaderboard`
 */
export const getLeaderboard = async (
  count = 5
): Promise<ILeaderboard | null> => {
  const endpoint = `${process.env["API_URL"]}/leaderboard`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.log("Error fetching leaderboard from database.");
      return null;
    }

    const json: IApiResponse = await response.json();
    let data = json.data;
    data = { ...data, rankings: data.rankings.slice(0, 5) }; // Grab 5 rankings for Discord embed

    return data;
  } catch (error) {
    console.log(`Error fetching leaderboard from database: ${error}`);
    return null;
  }
};

/**
 * Creates a leaderboard in the backend
 * @param leaderboard A `ILeaderboard`
 */
export const postLeaderboard = async (
  leaderboard: ILeaderboard
): Promise<void> => {
  const endpoint = `${process.env["API_URL"]}/leaderboard`;

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leaderboard),
    });
  } catch (error) {
    console.error("Error creating leaderboard in database.");
  }
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
    displayName: user.displayName,
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
  author: IMember
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
  emoji: GuildEmoji | ReactionEmoji | ApplicationEmoji
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
    (channel) => channel !== null && channel.type === ChannelType.GuildText
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
 * See: https://discordjs.guide/slash-commands/response-methods.html#editing-responses
 * @param interaction The `CommandInteraction` to call
 * @param onlyAdmins Authorize only admins to call the interaction
 * @returns A `boolean`
 */
export const isInteractionAllowed = async (
  interaction: CommandInteraction,
  onlyAdmins: boolean = true
): Promise<boolean> => {
  const guild = interaction.guild;
  const isValidAdmin = Object.values(Admins).includes(interaction.user.id);
  const isValidServer = Object.values(Servers).includes(guild!.id);

  if (onlyAdmins && !isValidAdmin) {
    await interaction.reply({
      content: "You can't run this command unless you're an admin.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }

  if (!isValidServer) {
    await interaction.reply({
      content: "You can't run this command inside this server.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }

  return true;
};

export const buildLeaderboardEmbed = (
  leaderboard: ILeaderboard
): EmbedBuilder | null => {
  const rankings = leaderboard.rankings;
  if (!rankings || rankings.length === 0) {
    console.error("Leaderboard rankings are empty.");
    return null;
  }

  const green = "#77b255";
  const embed = new EmbedBuilder()
    .setTitle("Yakuza Leaderboard")
    .setColor(green)
    // .createdAt is a string since it's JSON so we need to parse it
    // we aren't using the Date constructor because it's apparently
    // inconsistent on different browsers
    .setTimestamp(Date.parse(leaderboard.createdAt.toString()));

  rankings.forEach((ranking, index) => {
    const name = ranking.member.displayName;
    const message = ranking.message.content;
    const messageUrl = ranking.message.url;
    const yakuzas = ranking.reaction.count;

    embed.addFields({
      name: `#${++index} (${yakuzas} yakuzas)`,
      value: `
      ${name}: ${message}
      ${messageUrl}
      --------------------------
      `,
    });
  });

  return embed;
};
