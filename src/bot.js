const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs").promises; // Using Promises for Asynchrony
const chalk = require('chalk');
const loadCommands = require('./commands/index'); // Import the command loading function

const { GatewayIntentBits } = require('discord.js');

const client = new Discord.Client({
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
    GatewayIntentBits.AutoModerationExecution // Access to automatic moderation rules execution moderation
  ]
});

const config = require('./config/config.json');
const settings = require('./config/settings.json');
client.commands = new Enmap();
client.config = config;

// Asynchronous function for loading events
async function loadEvents() {
  const files = await fs.readdir("./events/");
  for (const file of files) {
    const event = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log(chalk.green(`[+] Loaded event: ${eventName}`));
  }
}

// Asynchronous function for loading events
async function handleCommand(message) {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) {
    console.error(`Command ${commandName} not found`);
    return;
  }

  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(`Error executing command: ${error}`);
    message.reply('There was an error trying to execute that command!');
  }
}

// Use a function to handle messages
client.on('messageCreate', handleCommand);

// Initialize loading of commands and events
(async () => {
  await loadCommands(client); // Pass the client to the command loading function
  await loadEvents(); // Loading events
  await client.login(config.token); // Discord client login
})();

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


module.exports.client = client; // Exporting the client
