const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!message.member.hasPermission("KICK_MEMBERS"))
        return client.util.embed(message, {title:"Oops!", desc:"You don't have permission to do that!", color:"red"})

    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(suffix[0]);

    if (!toMute)
        return client.util.embed(message, {title:"Oops!", desc:"You must mention a member or their ID!", color:"red"})
    if (toMute.id == message.author.id || toMute.id == client.user.id)
        return client.util.embed(message, {title:"Hey!", desc:"What are you doing?!", color:"red"})
    if (toMute.highestRole.position >= message.member.highestRole.position && message.author.id !== message.guild.owner.user.id)
        return client.util.embed(message, { title:"Oops!", desc:"You're muting someone higher than or at the same level as you.", color:"red"})
    
    // if the client (taken as a member of the guild) doesn't have perms, error
    if (!message.guild.me.hasPermission("MANAGE_ROLES"))
        return client.util.embed(message, { title:"Oops!", desc:`I do not have permission to mute ${toMute.user.username}.`, color:"red"})
    
    if (suffix[1] && (isNaN(suffix[1]) || suffix[1] < 0.1 || suffix[1] > 672)) // if there is a time limit set, validate input
        return client.util.embed(message, {title:"Oops!", desc:"You must specify the number of hours to mute someone between 0.1 and 672 (28 days).", color:"red"})
    
    
    let role = message.guild.roles.find(r => r.name === "Muted by Iris");
    if (!role) {
        try {
            role = await message.guild.createRole({
                name: "Muted by Iris",
                color: "#010101",
                permissions: []
            });
    
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }
    
    if (toMute.roles.has(role.id)) return client.util.embed(message, {title:"Oops!", desc:`${toMute} is already muted!`, color:"red"})
    
    let hours = 1;
    if (suffix[1]) hours = suffix[1];
    
    info = guilds.get(message.guild.id);
    if (!info.mutes) info.mutes = {};
    info.mutes[toMute.id] = {
        user: toMute.id,
        guild: message.guild.id,
        time: Math.round((new Date()).getTime()) + (hours * 3600000)
    }

    guilds.set(message.guild.id, info);
    await toMute.addRole(role);
    
    client.util.createEmbed({ title:"Uh oh!", desc:`${message.author.username} has muted you in ${toMute.guild.name}. Time to rethink something?`, color:"yellow"}).then(e => toMute.send(e))
    client.util.embed(message, {title:"Done!", desc:`${toMute} is muted for ${hours} hours.`, color:"green"})
}

module.exports.help = {
    usage: "<mention/ID> [# of hours]",
    description: "Mutes a user for specified number of hours. (1h by default)",
    category: "moderation"
}