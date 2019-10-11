const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!message.member.hasPermission("BAN_MEMBERS"))
        return client.util.embed(message, {title:"Oops!", desc:"You don't have permission to do that!", color:"red"})

    let uid = suffix[0];

    if (!uid)
        return client.util.embed(message, {title:"Oops!", desc:`Provide an ID.`, color:"red"})

    message.guild.fetchBans().then(bans => {
        ban = bans.get(uid);
        if (!ban) return client.util.embed(message, {title:"Oops!", desc:`There is no banned user with ID ${uid}.`, color:"red"})
        message.guild.unban(ban)
        client.util.embed(message, {title:"Done!", desc:`Unbanned ${uid}.`, color:"green"})
    }).catch(e => {
        client.util.embed(message, {title:"Oops!", desc:`Unexpected error: \`\`\`${e}\`\`\``, color:"red"})
    });
}

module.exports.help = {
    usage: "<user ID>",
    description: "Hackbans a user.",
    category: "moderation"
}