const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!config.maintainers.includes(message.author.id))
        return client.util.embed(message, {title:"Shoo!", desc:"Maintainers only.", color:"red"})

    try {
        const code = suffix.join(" ");

        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);

        if (evaled.indexOf(client.token) !== -1 || evaled.indexOf(".token") !== -1)
            return client.util.embed(message, { title:"no", color:"red"})

        if (evaled.length > 1024) {
            hastebin = require("hastebin-generator")
            return hastebin(evaled, 'js').then(url => {
                client.util.embed(message, {title:"Done!", desc:`Since the output was too long, [I posted it here](${url}).`, color:"green"})
            })
        }
        client.util.embed(message, {title:"Done!", desc:` \`${evaled}\` `, color:"green"})
    } catch (err) {
        client.util.embed(message, {title:":thinking: oh", desc:` \`\`\`xl\n${err}\n\`\`\` `, color:"red"})
    }
}

module.exports.help = {
    usage: "<js>",
    description: "Evals js.",
    category: "developer"
}