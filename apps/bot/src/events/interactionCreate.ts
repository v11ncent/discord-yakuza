import { MessageFlags, Events, CommandInteraction } from "discord.js";
import { CommandsClient } from "../types/commandsClient.js";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const botClient = interaction.client as CommandsClient;
    const command: any = botClient.commands?.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
