module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!message.member.hasPermission("MUTE_MEMBERS"))
        return message.channel.send(client.util.embed(message, {title:"Oops!", desc:"You don't have permission to do that!", color:"red"}));

    let toUnmute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(suffix[0]);
    if (!toUnmute)
        return message.channel.send(client.util.embed(message, {title:"Oops!", desc:"You must mention a user or their ID!", color:"red"}));
    if (toUnmute.id == message.author.id || toUnmute.id == client.user.id)
        return client.util.embed(message, {title:"Hey!", desc:"What are you doing?!", color:"red"})
    if (toUnmute.highestRole.position >= message.member.highestRole.position && message.author.id !== message.guild.owner.user.id)
        return client.util.embed(message, { title:"Oops!", desc:"You're unmuting someone higher than or at the same level as you.", color:"red"})
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) // if the client (taken as a member of the guild) doesn't have perms, error
        return client.util.embed(message, { title:"Oops!", desc:`I do not have permission to unmute ${toMute.user.username}.`, color:"red"})
    let role = message.guild.roles.find(r => r.name === "Muted by Iris");
    
    if (!role || !toUnmute.roles.has(role.id))
        return message.channel.send(client.util.embed(message, {title:"Oops!", desc:`${toUnmute} is already unmuted!`, color:"red"}));

    info = guilds.get(message.guild.id);
    delete info.mutes[toUnmute.id];
    guilds.set(message.guild.id, info);

    await toUnmute.removeRole(role);

    client.util.createEmbed({ title:"Hurray!", desc:`${message.author.username} has unmuted you in ${toUnmute.guild.name}!`, color:"green"}).then(e => toUnmute.send(e))
    client.util.embed(message, {title:"Done!", desc:`${toUnmute} is unmuted.`, color:"green"});
}

module.exports.help = {
    usage: "<mention/ID>",
    description: "Unmutes a muted user.",
    category: "moderation"
}