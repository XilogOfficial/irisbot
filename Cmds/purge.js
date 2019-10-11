const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    const deleteCount = parseInt(suffix[0], 10);

    // check if they can manage msgs in the channel
    if (!message.channel.permissionsFor(message.member).hasPermission("MANAGE_MESSAGES"))
        return client.util.embed(message, {title:"Oops!", desc:"You don't have permission to do that!", color:"red"})
    if (!deleteCount || isNaN(deletecount) || deleteCount < 2 || deleteCount > 100)
        return client.util.embed(message, {title:"Oops!", desc:"Provide a number between 2 and 100 for the number of messages to delete.", color:"red"})

    // if the BOT can't delete msgs in the channel, error
    if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES"))
        client.util.embed(message, {title:"Oops!", desc:"I do not have permission to delete messages.", color:"red"})

    const messages = message.channel.fetchMessages({
        limit: deleteCount+1
    }).then(messages => message.channel.bulkDelete(messages).catch(err => client.util.embed(message, {title:"Oops!", desc:`${err}`, color:"red"})))
        
    client.util.embed(message, {title:"Done!", desc:`Deleted last ${deleteCount} messages.`, color:"green"})
}

module.exports.help = {
    usage: "<# of messages from 2-100>",
    description: "Purges (deletes) up to 100 messages.",
    category: "moderation"
}