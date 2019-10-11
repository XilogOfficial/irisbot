const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!message.member.hasPermission("BAN_MEMBERS"))
        return client.util.embed(message, {title:"Oops!", desc:"You don't have permission to do that!", color:"red"})

    let uid = suffix[0];

    if (!uid)
        return client.util.embed(message, {title:"Oops!", desc:`Provide an ID.`, color:"red"})
    if (uid == client.user.id || uid == message.author.id)
        return client.util.embed(message, {title:"Hey!", desc:"What are you doing?!", color:"red"})

    client.fetchUser(uid).then(usr => {


        message.guild.ban(usr).catch(e => { // ban user, if error caught then return with an error msg
            return client.util.embed(message, {title:"Oops!", desc:`Failed to ban ${uid}. Send this to the author of the bot: \`\`\`${e}\`\`\``, color:"red"})
        })

        // confirm and log the ban
        client.util.embed(message, {title:"Done!", desc:`Banned ${uid} (${usr.tag}).`, color:"green"})
        client.util.log(message, guilds, "Hackban", `${message.author.tag} has hackbanned ID ${uid} (${usr.tag})!`)
    }).catch(() => {
        // if fetchuser does not work this user doesn't exist
        client.util.embed(message, {title:"Oops!", desc:`There is no user with ID ${uid}.`, color:"red"})
    })
}

module.exports.help = {
    usage: "<user ID>",
    description: "Hackbans a user.",
    category: "moderation"
}