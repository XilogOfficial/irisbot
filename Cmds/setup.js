const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    colors = "";
    for (var i in config.colors) {
        colors += `${i} - ${config.colors[i]}\n`
    }
    // SETTINGS INFO, SCROLL DOWN FOR CMD CODE
    settings = {
        prefix: {
            title: "Prefix", desc: "Sets the prefix of the bot.",
            prompt: "Enter your prefix below."
        },
        channeljoin: {
            title: "Welcome Channel", desc: "Sets the channel for welcome messages.",
            prompt: "Mention a channel below.",
            invalid: "Please mention a channel in this guild.",
            type: "channel"
        },
        channelleave: {
            title: "Leave Channel", desc: "Sets the channel for goodbye messages.",
            prompt: "Mention a channel below.",
            invalid: "Please mention a channel in this guild.",
            type: "channel"
        },
        logs: {
            title: "Logs", desc: "Sets the logging channel.",
            prompt: "Mention a channel below.",
            invalid: "Please mention a channel in this guild.",
            type: "channel"
        }
    }
    
    
    
    
    
    guild = message.guild;
    conf = guilds.get(guild.id);
    
    if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== message.guild.owner.id)
    return util.embed(message, {title:"Oops!", desc:"You do not have the \"Administrator\" permission.", color:"red"})
    
    
    embed = new discord.RichEmbed()
    .setTitle("Setting up Iris!")
    .setDescription(`
    __So it's time to get me ready for your server, huh?__
    Reply with your chosen setting or click :x: to close.
    `)
    .setColor(config.color)
    
    for (var i in settings) {
        embed.addField(settings[i].title, `${settings[i].desc}\nType ${i.toLowerCase()} to choose.`, true)
    }

    let key; // the setting to be changed (eg: "prefix") this will be set later
    
    message.channel.send(embed).then(category => {
        // MSG COLLECTOR
        const collector = new discord.MessageCollector(category.channel, m => m.author.id === message.author.id, { time: 20000 });
        
        collector.on('collect', m => {
            key = m.content.toLowerCase(); // this will be used later to determine what setting has to be changed
            
            if (!settings[key]) // if key does not exist in settings
                return collector.stop("invalid")
            
            collector.stop("responded") // if responded then ok
            

            currentSetting = conf[key] // what is the current value of that setting?
            if (settings[key].type == "channel" && message.guild.channels.get(conf[key]))
                currentSetting = message.guild.channels.get(conf[key]).name
                // if the setting type is a channel and that channel exists,
                // set the current value to the name of the channel, not the ID

            // get reply now
            util.embed(message, {
                title: settings[key].title,
                desc: settings[key].prompt, 
                footer: `Current setting: ${currentSetting}`
            }).then(msg => {
                category.delete() // delete the big "choose category" message
                
                // MSG COLLECTOR
                const collector = new discord.MessageCollector(msg.channel, m => m.author.id === message.author.id, { time: 20000 });
                
                collector.on('collect', m => { // when get reply
                    input = m.content.toLowerCase(); // input
                    isValid = false; // is valid respone; will be set later
                    let response; // the actual value to change setting to
                    
                    switch (key) { // switch based on setting to be changed
                        case "channeljoin":
                        case "channelleave":
                        case "logs":
                            if (m.mentions.channels.first()) { isValid = true; response = m.mentions.channels.first().id }
                            console.log("pp")
                        break;
                        default:
                            isValid = true; response = input
                    }
                    
                    if (!isValid) return collector.stop("invalid") // if invalid stop with reason "invalid"
                    
                    if (conf[key]) conf[key] = response; // if guild config has this setting change it to the reply
                    guilds.set(m.guild.id, conf) // save
                    
                    // confirm and log
                    util.embed(message, {title:"Done!", desc:`Guild config item \`${key}\` has been changed to: \`${response}\``, color:"green"})
                    util.log(message, "Setup", `${message.author.tag} has changed setting \`${key}\` to \`${response}\`!`)
                    collector.stop("responded") // stop with reason "responded"
                })
                
                collector.on('end', (c, reason) => {
                    if (reason == "invalid") // if invalid then tell em
                        util.embed(message, {title:"Oops!", desc:`That's an invalid response! \n${settings[key].invalid}`, color:"red"})
                    else if (reason == "cancelled") // else if cancelled then be like ok
                        util.embed(message, {title:"Done!", desc:"Cancelled.", color:"green"})
                    else if (reason !== "responded") { // else if not responded then time up
                        util.embed(message, {title:"Oops!", desc:"Setup Cancelled: Time up.", color:"red"})
                        msg.delete()
                    }
                })
                
                
                // REACTION COLLECTOR
                msg.react('❌')
                const reactCollector = msg.createReactionCollector((r, user) => r.emoji.name == '❌' && user.id == message.author.id, { time: 20000 });
                
                reactCollector.on('collect', r => {
                    r.users.forEach((v,k) => {
                        if (k !== message.author.id) return r.remove(k);
                    })
                    msg.delete()
                    collector.stop("cancelled")
                    reactCollector.stop()
                })
            })
        })


        collector.on('end', (c, reason) => {
            if (reason == "invalid") // if invalid then tell em
                util.embed(message, {title:"Oops!", desc:`That's an invalid choice.`, color:"red"})
            else if (reason == "cancelled") // else if cancelled then be like ok
                util.embed(message, {title:"Done!", desc:"Cancelled.", color:"green"})
            else if (reason !== "responded") // else if not responded then time up
                util.embed(message, {title:"Oops!", desc:"Setup Cancelled: Time up.", color:"red"})
        
            category.delete() // delete "choose category" message
        })
        
        
        
        // REACTION COLLECTOR
        category.react('❌')
        const reactCollector = category.createReactionCollector((r, user) => r.emoji.name == '❌' && user.id == message.author.id, { time: 20000 });
        
        reactCollector.on('collect', r => {
            r.users.forEach((v,k) => {
                if (k !== message.author.id) return r.remove(k);
            })
            category.delete()
            collector.stop("cancelled")
            reactCollector.stop()
        })
    })
}

module.exports.help = {
    usage: "[<key> <value>]",
    description: "Sets server config.",
    category: "utility"
}