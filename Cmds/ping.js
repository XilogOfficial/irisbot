const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
        client.util.embed(message, { title:"pingity pong!", desc:"Pinging...", color:"yellow"}).then(msg => {
            msg.delete();
            client.util.embed(message, { title:":ping_pong: Pong!", desc:`${Math.floor(client.ping)} ms`});
        });
}

module.exports.help = {
    usage: "",
    description: "Pings the bot.",
    category: "utility"
}