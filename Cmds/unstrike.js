const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!message.member.hasPermission("KICK_MEMBERS"))
        return client.util.embed(message, {title:"Oops!", desc:"You don't have permission to do that!", color:"red"});

    let member = message.mentions.members.first();

    if (!member)
        return client.util.embed(message, {title:"Oops!", desc:"You must mention a member to unstrike.", color:"red"});
    if (message.member.highestRole.position <= member.highestRole.position && message.author.id !== message.guild.owner.user.id)
        return client.util.embed(message, {title:"Oops!", desc:"You're unstriking someone higher than or at the same level as you.", color:"red"});

    info = guilds.get(message.guild.id);
    gStrikes = info.strikes;

    sid = suffix.join(" ").slice(suffix[0].length + 1);
    if (!sid || sid == null) return client.util.embed(message, {title:"Oops!", desc:"Please provide a strike ID!", color:"red"});

    if (!gStrikes[member.id])
        return client.util.embed(message, {title:"Oops!", desc:`${memeber.user.username} doesn't have any strikes!`, color:"yellow"})
    if (!gStrikes[member.id][sid] || gStrikes[member.id][sid] == null)
        return client.util.embed(message, {title:`"${sid}" is not a valid strike ID!`, desc:`Please do =strikes ${member} to get their strikes and strike IDs.`, color:"red"});

    strike = gStrikes[member.id][sid];
    delete gStrikes[member.id][sid];
    info.strikes = gStrikes;
    guilds.set(message.guild.id, info);
    
    client.util.createEmbed({ title:"Hurray!", desc:`${message.author.username} has removed your strike in ${member.guild.name}. The strike \`${strike.reason}\` was issued by ${strike.user}.`, color:"green"}).then(e => member.send(e))
    client.util.embed(message, {title:"Done!", desc:`Strike ${sid} was removed from ${member.user.username}.`, color:"green"});
}

module.exports.help = {
    usage: "<user> <strike id>",
    description: "Removes a user's strikes.",
    category: "moderation"
}