const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    let user = message.author;
    if (message.mentions.users.size > 0) user = message.mentions.users.first();

    gStrikes = guilds.get(message.guild.id).strikes;
    if (isEmpty(gStrikes)) return client.util.embed(message, {title:":tada:", desc:`Nobody has been stricken in this server yet!`, color:"green"});

    strikes = gStrikes[user.id];
    if (isEmpty(strikes)) return client.util.embed(message, {title:":ok_hand:", desc:`${user.username} has no strikes.`, color:"green"});

    strikesEmb = new discord.RichEmbed()
        .setTitle(`${user.username}'s strikes:`)
        .setColor(client.config.color)
    
    strikeKeys = "";
    Object.keys(strikes).forEach(key => {
        if (Object.keys(strikes).length <= 25) {
            strikesEmb.addField(`__${key}__ by ${strikes[key].user}`, strikes[key].reason)
        } else {
            strikeKeys += `${key} : "${strikes[key].reason}" by ${strikes[key].user}\n`;
        }
    });

    if (strikeKeys.length >= 1024) {
        hastebin = require("hastebin-generator")
        return hastebin(strikeKeys, 'js').then(url => {
            client.util.embed(message, {title:"Strikes", desc:`Since the output was too long, I posted the output [here](${url})`})
        })
    }

    if (Object.keys(strikes).length > 25) strikesEmb.setDescription(strikeKeys);
    message.channel.send(strikesEmb);
}

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
    description: "Shows strikes of a user.",
    category: "moderation"
}