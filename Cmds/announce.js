const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) // if the member is not staff, deny permission
        return client.util.embed(message, {title: "Oops!", desc: "You don't have permission to do that!", color:"red"});

    if (suffix.length < 1) // check if there are no args
        return client.util.embed(message, {title: "Oops!", desc: "Do you really just want to announce your name and nothing else?", color:"red"});
    
    if (message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) // if bot can manage messages
        message.delete().catch(e => {}); // delete original command

    let embed = new discord.RichEmbed() // new message
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(config.color)
        .setDescription(suffix.join(" "));

    message.channel.send(embed)
}

module.exports.help = {
    usage: "<announcement>",
    description: "Makes a nice looking announcement. (For staff)",
    category: "moderation"
}