## Message fetching

I want to fetch all messages from all channels in the guild that the `initialize` command was called from. We can't fetch messages from a specific user, so we need to sort through all the messages in a guild, and then filter by member.

1. Grab all text channels from guild where command was called from,
2. Grab all messages from each text channel,
3. Iterate through array of messages and filter by user,
4. Save highest rated message for each user in database.

# Misc

Basically Guilds, Channels, Roles and PermissionOverwrites are all cached on ready with Guilds intent. The rest is cached when received from a gateway event
