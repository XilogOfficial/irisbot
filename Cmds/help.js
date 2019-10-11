const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if(suffix[0]) {
        let help = client.commands[suffix[0]];
        if (!help) return client.util.embed(message, {title:"Oops!", desc:`"${suffix[0]}" is not a command.`, color:"red"});
        help = help.help;

        let embed = new discord.RichEmbed()
            .setTitle(`Help: ${suffix[0]}`)
            .setDescription("<> is a required argument. \n[] is an optional argument.")
            .setColor(config.color)
            .addField(`Description`, help.description)
            .addField(`Usage`, `${guilds.get(message.guild.id).prefix}${suffix[0]} ${help.usage}`, true)
            .addField(`Category`, help.category, true);

        return message.channel.send(embed);
    }

    cmds = {
        "general": [],
        "moderation": [],
        "fun": [],
        "utility": [],
        "developer": []
    }

    for (var cmd in client.commands) {
        let help = client.commands[cmd].help; // the help of the command, with category usage description etc
        set = `__${cmd}__ - ${help.description}`; // make the line in the help command for this cmd with its name and desc
        if(cmds[help.category])
            cmds[help.category].push(set)
    }
    

    let help = new discord.RichEmbed()
        .setTitle("Help")
        .setDescription(`For more info on a specific command, please do ${guilds.get(message.guild.id).prefix}help [command]`)
        .setColor(config.color)
        .addField("General", cmds.general.join("\n"))
        .addField("Moderation", cmds.moderation.join("\n"))
        //.addField("Fun", cmds.fun.join("\n"))
        .addField("Utility", cmds.utility.join("\n"))
    if (config.maintainers.includes(message.author.id))
        help.addField("__Developer Only__", cmds.developer.join("\n"))


    message.author.send(help).catch(e => {
        return client.util.embed(message, {title:"Help", desc:"Error while sending DMs. Check that you are not blocking DMs.", color:"red"})
    });

    client.util.embed(message, {title:"Help", desc:"Check your DMs!", footer: `v${client.version}`, color:"green"})
}

module.exports.help = {
    usage: "[command]",
    description: "List of commands or details about a specific command.",
    category: "general"
}