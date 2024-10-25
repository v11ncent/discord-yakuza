// Fetches all messages & stores data in database
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Admins } from "../../shared/enums/admins";
import { Servers } from "../../shared/enums/servers";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initialize")
    .setDescription("Fetches & stores message data in the database."),

  async execute(interaction: CommandInteraction) {
    if (isAllowed(interaction, true)) {
      await interaction.reply(interaction.guildId as string);
    } else {
      await interaction.reply({
        content: "You can't run this command unless you're an admin 🤭",
        ephemeral: true,
      });
    }
  },
};

const isFromServer = (interaction: CommandInteraction): boolean => {
  // https://discord.com/developers/docs/interactions
  const GUILD_INTERACTION = 0;

  return interaction.context === GUILD_INTERACTION;
};

const isAllowed = (
  interaction: CommandInteraction,
  onlyAdmins?: boolean,
): boolean => {
  if (!isFromServer(interaction)) {
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
