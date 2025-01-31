// Fetches all messages & stores data in database
import {
  SlashCommandBuilder,
  CommandInteraction,
  Guild,
  ChannelType,
  TextChannel,
  Message,
  User,
} from "discord.js";
import { isInteractionAllowed } from "../helpers/index";

type Leaderboard = {
  member: User;
  message: Message;
  count: number;
}[];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initialize")
    .setDescription("Fetches & stores message data in the database."),

  async execute(interaction: CommandInteraction) {
    const guild = interaction.guild;

    if (isInteractionAllowed(interaction) && guild) {
      // Defer reply since getAllGuildMessages() takes longer than 3 seconds,
      // see: https://discordjs.guide/slash-commands/response-methods.html#editing-responses
      await interaction.deferReply();

      getAllGuildMessages(guild).then(async (leaderboard) => {
        if (leaderboard) {
          const first = leaderboard[0];
          await interaction.editReply(
            `Author: ${first?.member}\nMessage: ${first?.message}\nYakuza up count: ${first?.count}`,
          );
        }
      });
    } else {
      await interaction.reply({
        content: "You can't run this command unless you're an admin 🤭",
        ephemeral: true,
      });
    }
  },
};

const getAllGuildMessages = async (guild: Guild) => {
  const channels = await getAllGuildTextChannels(guild);
  const channel = channels.values().next().value; // Get first for testing

  if (channel) {
    const leaderboard = await getAllMessagesFromChannel(channel);
    return leaderboard;
  }

  return null;
};

// Get all messages in a channel
// https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
const getAllMessagesFromChannel = async (channel: TextChannel) => {
  let pack = await channel.messages.fetch({ limit: 100 });
  let pivot = pack.last();
  let messages = [...pack.values()].filter((message) => {
    return message.author.bot === false;
  });
  let leaderboard: Leaderboard = [];
  log(channel.name, messages.length);

  while (pivot !== undefined && messages.length < 200) {
    pack = await channel.messages.fetch({
      limit: 100,
      before: pivot.id,
    });

    const userMessages = [...pack.values()].filter((message) => {
      return message.author.bot === false;
    });

    pivot = pack.last();
    messages = [...messages, ...userMessages];
    leaderboard = initializeLeaderboard(messages);

    log(channel.name, messages.length);
  }

  console.log(`${channel.name} channel message fetch operation finished.`);
  // return messages;

  return leaderboard;
};

// Update leaderboard -> Get all messages -> update every batch of 100

// Update leaderboard on every iteration of getAllMessagesFromChannel()
const initializeLeaderboard = (messages: Message[]): Leaderboard | [] => {
  // Just grabbing the first for testing
  const first = messages[0];

  if (first) {
    const count = getMessageReactionCount(first);

    return [
      {
        member: first.author,
        message: first,
        count,
      },
    ];
  }

  return [];
};

/**
 * Get specific reaction counts on a message.
 * @param message A text message.
 * @param filter A list of reactions to filter for. Defaults to yakuza up.
 * @returns
 */
const getMessageReactionCount = (
  message: Message,
  filter: string[] = ["💹"],
) => {
  const [...all] = message.reactions.cache.values();

  const find = all.filter((reaction) => {
    const name = reaction.emoji.name ?? "";
    return filter.includes(name);
  });

  return find[0]?.count ?? 0;
};

const getAllGuildTextChannels = async (guild: Guild) => {
  return guild.channels.cache.filter(
    (channel) => channel !== null && channel.type === ChannelType.GuildText,
  );
};

const log = (channelName: string, messagesLength: number) => {
  console.log(
    `Getting all messages from ${channelName}: ${messagesLength} / 1000...`,
  );
};
