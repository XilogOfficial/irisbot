const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    let configKeys = "";
    conf = guilds.get(message.guild.id);
    delete conf.strikes;
    delete conf.mutes;
    Object.keys(conf).forEach(key => {
      configKeys += `${key}  :  "${conf[key]}"\n`;
    });
    message.channel.send(`Current config for this server: \`\`\`${configKeys}\`\`\``);
}

module.exports.help = {
    usage: "",
    description: "Shows server config.",
    category: "utility"
}