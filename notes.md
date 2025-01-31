## Message fetching

I want to fetch all messages from all channels in the guild that the `initialize` command was called from. We can't fetch messages from a specific user, so we need to sort through all the messages in a guild, and then filter by member.

1. Grab all text channels from guild where command was called from,
2. Grab all messages from each text channel, (done)
3. Iterate through array of messages and filter by user,
4. Save highest rated message for each user in database.

## Update leaderboard

To update the leaderboard, we need to grab the emoji count for each user:

1. Get all messages, (done)
2. Filter a single message for a list of emojis and get their respective count,
3. Update leaderboard (?)

## Misc

Basically Guilds, Channels, Roles and PermissionOverwrites are all cached on ready with Guilds intent. The rest is cached when received from a gateway event
