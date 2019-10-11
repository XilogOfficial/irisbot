const discord = require("discord.js");

module.exports.run = async (message, suffix) => {
    if (!message.member.hasPermission("KICK_MEMBERS"))
        return client.util.embed(message, {title:"Oops!", desc:"You don't have permission to do that!", color:"red"});

    let member = message.mentions.members.first();

    if (!member)
        return client.util.embed(message, {title:"Oops!", desc:"You must mention a member to strike!", color:"red"});
    if (message.member.highestRole.position <= member.highestRole.position && message.author.id !== message.guild.owner.user.id)
        return client.util.embed(message, {title:"Oops!", desc:"You're striking someone higher than or at the same level as you.", color:"red"});
    if (member.id == message.author.id)
        return client.util.embed(message, {title:"Oops!", desc:"You can't strike yourself.", color:"red"});
    if (member.id == client.user.id)
        return client.util.embed(message, {title:"Hey!", desc:"What are you doing?!", color:"red"});
    if (!suffix[1] || suffix[1] == null)
        return client.util.embed(message, {title:"Oops!", desc:`Provide a reason to strike ${member.user.username}!`, color:"red"});

    sid = (+new Date).toString(36).slice(-5)
    info = guilds.get(member.guild.id);

    if (!info.strikes) info.strikes = {};
    strikes = info.strikes;

    reason = suffix.slice(1).join(' ');
    if (reason.length > 1000)
        return client.util.embed(message, {title:"Oops!", desc:`Reason too long, please keep it <1000 characters.`, color:"red"});

    if (!strikes[member.id]) {
        strikes[member.id] = {}
        strikes[member.id][sid] = { reason: reason, user: message.author.tag };
    } else {
        while (strikes[member.id][sid]) { sid = (+new Date).toString(36).slice(-3) }
        strikes[member.id][sid] = { reason: reason, user: message.author.tag }
    }
    
    info.strikes = strikes;
    guilds.set(member.guild.id, info);
    client.util.createEmbed({ title:"Uh oh!", desc:`${message.author.username} has stricken you in ${member.guild.name} for \`${reason}\`. Time to rethink something?`, color:"yellow"}).then(e => member.send(e))
    client.util.embed(message, {title:"Done!", desc:`${member.user.username} was stricken for ${reason}.\nID: ${sid}`, color:"green"});
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
    usage: "<user> <reason>",
    description: "Strikes a user.",
    category: "moderation"
}