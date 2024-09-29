const { EmbedBuilder } = require("discord.js");
const prefix = require('../config/config.json');

module.exports.details = {
    name: 'help',
    author: 'j to the</ Discord: luckyark',
    icon: 'https://avatars.githubusercontent.com/u/13420378?v=4',
    description: 'Shows a list of available commands.',
    usage: `${prefix.prefix}help`
};

module.exports.execute = async (client, message, args) => {
    const commandList = client.commands.map(cmd => {
        return `\`${prefix.prefix}${cmd.details.name}\`: ${cmd.details.description}`;
    }).join('\n');

    const helpEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📜 Available Commands')
        .setDescription(commandList || 'No commands found.')
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: `Use ${prefix.prefix} before the commands`, iconURL: client.user.displayAvatarURL() });

    await message.channel.send({ embeds: [helpEmbed] });
};
