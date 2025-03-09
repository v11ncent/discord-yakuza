import { CommandInteraction, MessageFlags } from "discord.js";
import {
  buildLeaderboardEmbed,
  getLeaderboard,
  isInteractionAllowed,
} from "../helpers";

export const get = async (interaction: CommandInteraction) => {
  if (!(await isInteractionAllowed(interaction))) return;
  if (!interaction.guild) return;

  await interaction.deferReply();

  const leaderboard = await getLeaderboard();
  if (!leaderboard) {
    console.error("Leaderboard is empty.");
    return;
  }

  const embed = buildLeaderboardEmbed(leaderboard);
  if (embed) await interaction.editReply({ embeds: [embed] });
};
