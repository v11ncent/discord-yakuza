import { SlashCommandBuilder, CommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Displays the leaderboard.")
    .addMentionableOption((option) =>
      option
        .setName("Member")
        .setDescription("The member to lookup")
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      ephemeral: true,
      content: "Pretend there's a leaderboard here!",
    });
  },
};
