import { CommandInteraction, Message, Guild, ChannelType } from "discord.js";
import { Admins } from "../../shared/enums/admins";
import { Servers } from "../../shared/enums/servers";

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
  const guild = interaction.guildId;
  if (!guild) return false; // Return false if not in guild

  if (onlyAdmins) {
    return Object.values(Admins).includes(interaction.user.id);
  }

  return !Object.values(Servers).includes(guild);
};
