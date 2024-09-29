const path = require("path");
const fs = require("fs").promises; // Using Promises for Asynchrony

const normalizedPath = path.join(__dirname);
const commands = {};

// Asynchronous function for loading commands
async function loadCommands(client) {
  const files = await fs.readdir(normalizedPath);
  for (const file of files) {
    if (file === "index.js") continue; // Skip the index.js file itself
    const command = require(`./${file}`);

    // Check that the command has the required properties
    if (command.details && command.details.name && command.execute) {
      commands[command.details.name] = command;
      client.commands.set(command.details.name, command); // Save the command in Enmap
      console.log(`Loaded command: ${command.details.name}`);

    } else {
      console.error(`Command ${file} is missing required properties.`);
    }
  }
}

// Export the command loading function for use in bot.js
module.exports = loadCommands; 
