// Please leave this file, this is used to import all commands!
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

const commands = {};
const normalizedPath = path.join(__dirname);

// Read all files in the directory
fs.readdirSync(normalizedPath).forEach(file => {
  // Skip the index.js file itself and non-js files
  if (file === "index.js" || !file.endsWith('.js')) return;

  const commandName = path.basename(file, '.js'); // Get the command name without the extension
  try {
    commands[commandName] = require(`./${file}`); // Import the command
  } catch (error) {
    // Format the error message
    console.error(chalk.red(`[-] Error loading command: ${commandName}: ${error.message}`));
  }
});

module.exports = commands; // Export an object with commands
