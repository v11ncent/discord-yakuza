import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { initialize } from "./initialize";
import { get } from "./get";

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
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("get").setDescription("Gets saved leaderboard"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "initialize":
        initialize(interaction);
        break;
      case "get":
        get(interaction);
        break;
      default:
        break;
    }
  },
};
