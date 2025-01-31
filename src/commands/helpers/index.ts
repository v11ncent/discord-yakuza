import { CommandInteraction } from "discord.js";
import { Admins } from "../../shared/enums/admins";
import { Servers } from "../../shared/enums/servers";

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
