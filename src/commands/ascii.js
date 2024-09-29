const { EmbedBuilder } = require('discord.js');
const figlet = require('figlet');
const prefix = require('../config/config.json');


module.exports.details = {
    name: 'ascii',
    author: 'j to the</ Discord: luckyark',
    icon: 'https://avatars.githubusercontent.com/u/13420378?v=4',
    description: 'Create ASCII text.',
    usage: `${prefix.prefix}ascii`
};


function wordWrap(text, maxLength) {
    let wrapped = '';
    let words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length < maxLength) {
            currentLine += `${word} `;
        } else {
            wrapped += `${currentLine}\n`;
            currentLine = `${word} `;
        }
    });

    wrapped += currentLine;
    return wrapped.trim();
}

const fontSizeMapping = {
    'small': 'Small',
    'medium': 'Standard',
    'large': 'Big'
};

module.exports.execute = async (client, message, args) => {
    const text = args.join(' ');
    const sizeChoice = 'Big'; // Default size

    const wrappedText = wordWrap(text, 25);

    figlet(wrappedText, {
        font: fontSizeMapping[sizeChoice],
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, (err, data) => {
        if (err) {
            console.error('Something went wrong with figlet...');
            console.dir(err);
            return message.channel.send('Failed to convert text into ASCII art, please try again.');
        }
        if (data.length > 2000) {
            return message.channel.send('The generated ASCII art is too long for Discord!');
        }
        const asciiEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('ASCII Art')
            .setDescription(`\`\`\`${data}\`\`\``)
            .setFooter({ text: `The generated ASCII art is too long for Discord!`, iconURL: client.user.displayAvatarURL() });

        message.channel.send({ embeds: [asciiEmbed] });
    });
};

                                                                    