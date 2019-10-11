const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    userArr = [ message.author ];
    if (message.mentions.users.size > 3) return client.util.embed({ title:"Oops!", desc:"Max user limit is 3.", color:"red"}).then(e => message.channel.send(e));
    if (message.mentions.users.size > 1) userArr = message.mentions.users.array()
    else if (message.mentions.users.size > 0) userArr = [ message.mentions.users.first() ]

    createEmbeds(userArr, message, client);
}

function createEmbeds (users, message, client) {
    for (let i in users) {
        user = users[i]; // for simplicity shorten the current user from users[i] to just user

        bot = "No"; // for a Yes/No instead of true/false
        gamename = "[[None]]"; // set it to none, set it to game (if present) later on
        gamestream = "No"; // set it to no, set it to url (if streaming) later on
        
        if (user.bot) bot = "Yes"; // for a Yes/No instead of true/false
        if (user.presence.game) {
            gamename = user.presence.game.name; // set to game name
            if (user.presence.game.streaming) gamestream = user.presence.game.url; // if streaming set to url
        }

        let embed = new discord.RichEmbed() // create embed

        if (users.length > 1) { // edit it (compact or extravagant depending on if >1 mention or not)
            embed
                .setTitle(`Info for **${user.tag}** (${user.id})`)
                .setDescription(`
                __:calendar_spiral: Created__ - **${user.createdAt.toUTCString()}**
                __:robot: Is Bot?__ - **${bot}**
                __:red_circle: Status__ - **${user.presence.status.toUpperCase()}**
                __:video_game: Game__ - **${gamename}**
                __:camera: Avatar URL__ - **[Click me](${user.avatarURL})**
                `)
                .setColor(client.config.color)
                .setFooter("More detailed info is provided if a single user is mentioned.")
        } else {
            embed
                .setTitle("User Info")
                .setDescription(`Info for **${user.tag}**`)
                .setColor(client.config.color)
                .setThumbnail(user.avatarURL)
                .addField(":camera: Avatar URL", `[Click me](${user.avatarURL})`, true)
                .addField(":id: ID", user.id, true)
                .addField(":calendar_spiral: Created", user.createdAt.toUTCString(), true)
                .addField(":robot: Is Bot?", bot, true)
                .addField(":red_circle: Status", user.presence.status.toUpperCase(), true)
                .addField(":video_game: Game", `**Name:** ${gamename} \n**Streaming:** ${gamestream}`, true)
        }

        message.channel.send(embed); // send!
    }
}


module.exports.help = {
    usage: "[mention up to 3 members]",
    description: "Userinfo for you or another user.",
    category: "utility"
}