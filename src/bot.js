const { Client, GatewayIntentBits } = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const chalk = require('chalk');
const commands = require('./commands/index');
const config = require('./config/config.json');
const settings = require('./config/settings.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Access to guilds (servers)
    GatewayIntentBits.GuildMembers, // Access to guild members
    GatewayIntentBits.GuildBans, // Access to user bans
    GatewayIntentBits.GuildEmojisAndStickers, // Access to emojis and stickers
    GatewayIntentBits.GuildIntegrations, // Access to integrations
    GatewayIntentBits.GuildWebhooks, // Access to webhooks
    GatewayIntentBits.GuildInvites, // Access to invitations
    GatewayIntentBits.GuildVoiceStates, // Access to voice channels and user states
    GatewayIntentBits.GuildPresences, // Access to presence statuses (online/offline)
    GatewayIntentBits.GuildMessages, // Access to guild messages
    GatewayIntentBits.GuildMessageReactions, // Access to guild message reactions
    GatewayIntentBits.GuildMessageTyping, // Access to typing indicators
    GatewayIntentBits.DirectMessages, // Access to direct messages (Direct Messages)
    GatewayIntentBits.DirectMessageReactions, // Access to direct message reactions
    GatewayIntentBits.DirectMessageTyping, // Access to typing indicators in direct messages
    GatewayIntentBits.MessageContent, // Access to message content
    GatewayIntentBits.GuildScheduledEvents, // Access to scheduled guild events
    GatewayIntentBits.AutoModerationConfiguration, // Access to automatic moderation configuration
    GatewayIntentBits.AutoModerationExecution, // Access to automatic moderation rules execution moderation
  ]
});

client.commands = new Enmap();
client.config = config;

// Loading events
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  
  files.forEach(file => {
    const event = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

// Loading commands asynchronously
const loadCommands = async () => {
  const loadPromises = Object.keys(commands).map(async (commandName) => {
    if (settings.includes(commandName)) return;

    const props = commands[commandName];
    console.log(chalk.green(`[+] Loaded command: ${commandName}`));

    try {
      await client.commands.set(commandName, props);
    } catch (error) {
      console.error(`Error loading command ${commandName}: ${error}`);
    }
  });

  await Promise.all(loadPromises);
};

// Call the loadCommands function
loadCommands().catch(console.error);


// Command processing
client.on('messageCreate', message => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command || typeof command.execute !== 'function') {
    console.error(`Command ${commandName} not found or does not have an execute function`);
    return;
  }

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(`Error executing command: ${error}`);
    message.reply('There was an error trying to execute that command!');
  }
});

// When the bot is ready
client.on("ready", () => {
  client.user.setActivity('Set Activity', { type: 'WATCHING' });
});

client.login(config.token);

exports.client = client;
