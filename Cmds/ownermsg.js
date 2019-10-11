const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!config.maintainers.includes(message.author.id))
        return client.util.embed(message, {title:"Shoo!", desc:"Maintainers only.", color:"red"})

    toSend = suffix.join(" ")
    if (!toSend)
        return client.util.embed(message, {title:"Oops!", desc:"Gotta say something to the owners, dont' you?", color:"red"})
    
    try {
        client.guilds.map((guild) => {
            guild.owner.send(toSend).catch(e => {
                c = guild.channels.first;
                if (c.type === "text" && c.permissionsFor(this.client.user).has("VIEW_CHANNEL") && c.permissionsFor(this.client.user).has("SEND_MESSAGES")) {
                    c.send(toSay);
                }
            })
        });
    } catch (e) {
        console.log("Could not send message to a few guilds!");
    }
    client.util.embed(message, {title:"Done!", desc:"Sent to owners.", color:"green"})
}

module.exports.help = {
    usage: "<js>",
    description: "Evals js.",
    category: "developer"
}