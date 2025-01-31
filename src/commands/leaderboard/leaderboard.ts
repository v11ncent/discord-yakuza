import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { initialize } from "./initialize";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Yakuza leaderboard commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("initialize")
        .setDescription(
          "Initializes leaderboard by crawling all guild messages and storing inside database",
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "initialize":
        initialize(interaction);
        break;
      default:
        break;
    }
  },
};
