import { CommandInteraction, ChannelType, TextBasedChannel } from "discord.js";
import { Admins } from "../../shared/enums/admins";
import { Servers } from "../../shared/enums/servers";

// Checks if channel is of type `GuildText`
export function isGuildTextChannel(channel: TextBasedChannel | null) {
  return channel !== null && channel.type === ChannelType.GuildText;
}

// Determines if interaction came from a server (not a DM)
export const isInteractionFromServer = (
  interaction: CommandInteraction,
): boolean => {
  // https://discord.com/developers/docs/interactions
  const GUILD_INTERACTION = 0;
  return interaction.context === GUILD_INTERACTION;
};

// Checks if user is allowed to run interaction
export const isInteractionAllowed = (
  interaction: CommandInteraction,
  onlyAdmins: boolean = true,
): boolean => {
  if (!isInteractionFromServer(interaction)) {
    return false;
  }

  // Not sure why TS can't infer `guildId` type after the type guard
  if (!Object.values(Servers).includes(interaction.guildId as string)) {
    return false;
  }

  if (onlyAdmins) {
    return Object.values(Admins).includes(interaction.user.id);
  }

  return true;
};
