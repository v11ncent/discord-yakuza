## deferReply() times out after 15 minutes

If we run /leaderboard initialize, it can take 30+ minutes so we'll get an Invalid Webhook Token error at the end

## Streamlining message fetching and sending to backend

Very in the weeds. High level overview of what we need to do:

1. Get all messages that pass our qualifiers
2. Transform message data into format that's acceptable to backend model
3. Send model data to database

4. getAllGuildMessages() returns all guild messages

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

# Log

Created monorepo with Turborepo to abstract web app, discord bot, and server to their own 'apps'

# Is this a frontend or backend position?

# What type of projects would I be working on? How many projects do you guys have currently?

# Do you guys use source control?

# Documentation?

# Team structure e.g seniors / leads in team?

# If I don't know a question be honest and try to pull on previous experiences

I may not have done X, but I have done Y...
