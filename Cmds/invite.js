const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    let embed = new discord.RichEmbed()
        .setColor(config.color)
        .addField(":link: Like Iris?", `[Add it to a server!](${config.invite})`)
        .addField(":book: Need help?", `[Join the support server!](${config.support})`)
        .addField(":heart: Vote!", `Please [vote for the bot](${config.dblvote}) if you like it!`)

    message.channel.send(embed)
}

module.exports.help = {
    usage: "",
    description: "Invite Iris! (Or go to the support server)",
    category: "general"
}