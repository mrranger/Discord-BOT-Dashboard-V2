const { EmbedBuilder } = require('discord.js');
const prefix = require('../config/config.json');
const fetch = require('node-fetch');

module.exports.details = {
    name: 'meme',
    author: 'j to the</ Discord: luckyark',
    icon: 'https://avatars.githubusercontent.com/u/13420378?v=4',
    description: 'Get a random meme from r/dankmemes.',
    usage: `${prefix.prefix}meme`
};


module.exports.execute = async (client, message, args) => {
    try {
        const res = await fetch('https://www.reddit.com/r/dankmemes/random/.json');
        if (!res.ok) {
            throw new Error('Failed to fetch meme, Reddit API might be down or busy.');
        }
        const json = await res.json();
        const data = json[0].data.children[0].data;
        const memeUrl = `https://reddit.com${data.permalink}`;
        const memeImage = data.url;
        const memeTitle = data.title;
        const memeUpvotes = data.ups;
        const memeDownvotes = data.downs;
        const memeNumComments = data.num_comments;

        const embed = new EmbedBuilder()
            .setTitle(memeTitle)
            .setURL(memeUrl)
            .setImage(memeImage)
            .setColor("#000000")
            .setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`, iconURL: client.user.displayAvatarURL() });
        await message.channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching meme:', error);
        await message.channel.send({
            content: 'Sorry, I couldn\'t fetch a meme at the moment. Please try again later.',
        });
    }
};
