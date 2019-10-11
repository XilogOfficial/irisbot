const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    var date = new Date(null);
    date.setSeconds(client.uptime / 1000);
    

    client.util.embed(message, {
        author: { name: "Iris", img: client.user.avatarURL },
        desc: "Iris packs every popular moderation feature, fit to run any server.",
        fields: {
            "Created by": [ "@Xilog#6392" ],
            ":ping_pong: Ping:": [ `${Math.floor(client.ping)} ms`, true ],
            ":homes: Servers": [ client.guilds.size, true ],
            ":busts_in_silhouette: Users": [ client.users.size, true ],
            ":hash: Channels": [ client.channels.size, true ],
            ":calendar: Joined": [ message.guild.joinedAt.toISOString().replace(/T/, ' at ').replace(/\..+/, ''),  true ],
            "NodeJS": [ process.version, true ],
            "DiscordJS": [ `v${discord.version}`, true ],
            ":id: ID": [ client.user.id, true ],
            ":clock8: Uptime": [ date.toISOString().substr(11,8), true ],
            "Memory Usage": [ `${Math.floor(( process.memoryUsage().heapUsed / (1024*1024) ) * 10) / 10} MiB`, true ],
            ":minidisc: OS": [ process.platform, true ],
            ":link: Links": [ `[Website](https://irisbot.cf) \n [Invite](${config.invite})`, true ]
        },
        footer: `v${client.version}`
    })
}

module.exports.help = {
    usage: "",
    description: "About Iris.",
    category: "general"
}