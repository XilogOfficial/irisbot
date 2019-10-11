const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    let member = message.author;
    if (message.mentions.users.size > 0) member = message.mentions.users.first();

    user = users.get(member.id);
    if (isEmpty(user) || isEmpty(user.reminders)) return client.util.embed(message, {title:"Reminders", desc:`${member.username} has no reminders.`})
    rmds = user.reminders
    
    let rmdsKeys = "";
    let embed = new discord.RichEmbed()
        .setTitle(`${member.username}'s reminders:`)
        .setColor(config.color)

    Object.keys(rmds).forEach(key => {
        h = Math.round(((rmds[key].time - Date.now()) / 3600000) * 100) / 100;
        m = Math.round(((rmds[key].time - Date.now()) / 60000) * 10) / 10;
        if (Object.size(rmds) > 25) rmdsKeys += `${key}. "${rmds[key].msg}" in ${h} hours (${m}m)\n`;
        else embed.addField(`${key}. ${rmds[key].msg.substring(0,250)}`, `In ${h} hours (${m}m)`, true)
    });

    if (rmdsKeys.length >= 1024) {
        hastebin = require("hastebin-generator")
        return hastebin(rmdsKeys, 'js').then(url => {
            client.util.embed(message, {title:"Reminders", desc:`Since the output was too long, I posted the output [here](${url})`, color:"green"})
        })
    }
    
    if (Object.size(rmds) > 25) client.util.embed(message, {title:`${member.username}'s reminders:`, desc:`\`\`\`${rmdsKeys}\`\`\``, color:"green"})
    else message.channel.send(embed);
}

Object.size = (obj) => {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

module.exports.help = {
    usage: "[user]",
    description: "Shows reminders of a user.",
    category: "utility"
}