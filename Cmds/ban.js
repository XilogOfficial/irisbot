const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!message.member.hasPermission("BAN_MEMBERS"))
        return client.util.embed(message, { title:"Oops!", desc:"You don't have permission to do that!", color:"red"})

    let member = message.mentions.members.first();

    if (!member)
        return client.util.embed(message, { title:"Oops!", desc:"You must mention a member to ban.", color:"red"})
    if (member.id == client.user.id || member.id == message.author.id)
        return client.util.embed(message, { title:"Hey!", desc:"What are you doing?!", color:"red"})
    if (member.highestRole.position >= message.member.highestRole.position && message.author.id !== message.guild.owner.user.id) {
        return client.util.embed(message, { title:"Oops!", desc:"You're banning someone higher than or at the same level as you.", color:"red"})
    } else if (!member.bannable) {
        return client.util.embed(message, { title:"Oops!", desc:`I do not have permission to ban ${member.user.username}.`, color:"red"})
    }

    let reason = suffix.slice(1).join(' ');
    if (!reason) {
        reason = "~REASON NOT PROVIDED~"
        client.util.embed(message, { title: "Warning", desc: "Reason not provided.", color:"yellow"})
    }

    // send the user a tip that they have been banned
    client.util.createEmbed({ title:"Uh oh!", desc:`${message.author.username} has banned you from ${member.guild.name} for \`${reason}\`. Time to rethink something?`, color:"yellow"}).then(e => member.send(e))
    
    // ban the user, confirm it, then log
    await member.ban(reason).catch(error => message.channel.send(`Oops! ${error}`));
    client.util.embed(message, { title:"Done!", desc:`${member.user.username} has been banned by ${message.author.username}\nReason: ${reason}`, color:"green"})
    client.util.log(message, guilds, "Ban", `${message.author.tag} has banned ${member.user.tag} for \`${reason}\`!`)
}

module.exports.help = {
    usage: "<user> [reason]",
    description: "Bans a user.",
    category: "moderation"
}