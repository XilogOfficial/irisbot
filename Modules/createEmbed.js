const config = require('../config.js');
const discord = require('discord.js');

module.exports = (c) => {
    let embed = new discord.RichEmbed();

    if (!c) return;

    embed.setColor(config.color);
    if (c.color && config.colors[c.color]) embed.setColor(config.colors[c.color]);

    if (c.title) embed.setTitle(c.title);
    if (c.desc) embed.setDescription(c.desc)
    if (c.author && c.author.name) embed.setAuthor(c.author.name);
    if (c.author && c.author.name && c.author.image) embed.setAuthor(c.author.name, c.author.image)
    if (c.footer) embed.setFooter(c.footer);
    if (c.thumb) embed.setThumbnail(c.thumb);
    if (c.image) embed.setImage(c.image)

    if (c.fields) {
        for (var key in c.fields) {
            if (c.fields[key] && c.fields[key][1])
                embed.addField(key, c.fields[key][0], c.fields[key][1])
            else if (c.fields[key] && c.fields[key][0])
                embed.addField(key, c.fields[key][0])
        }
    }

    return embed;
}