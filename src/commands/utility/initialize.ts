// Fetches all messages & stores data in database
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Admins } from "../../shared/enums/admins";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initialize")
    .setDescription("Fetches & stores message data in the database."),
  async execute(interaction: CommandInteraction) {
    const userId = interaction.user.id;

    if (!isAdmin(userId)) {
      await interaction.reply(interaction.user.id);
    } else {
      await interaction.reply({
        content: "You can't run command this unless you're an admin.",
        ephemeral: true,
      });
    }
  },
};

const isAdmin = (userId: string): boolean => {
  if (Object.values(Admins).includes(userId)) {
    return true;
  }

  return false;
};
