module.exports = (client, message) => {
  // Ignore all messages from bots
  if (message.author.bot) return;

  // Ignore messages that do not start with the prefix (from config.json)
  if (!message.content.startsWith(client.config.prefix)) return;

  // Define the standard arguments and command name
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get command data from client.commands Enmap
  const cmd = client.commands.get(command);

  // If the command does not exist, exit
  if (!cmd) return;

  // Execute the command
  try {
    cmd.execute(client, message, args);
  } catch (error) {
    console.error(`Error executing command: ${error}`);
    message.reply('There was an error trying to execute that command!');
  }
};
