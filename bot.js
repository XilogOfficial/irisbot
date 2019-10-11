const discord = require('discord.js');
const config = require('./config');
const package = require('./package.json');
const fs = require('fs');

const client = new discord.Client();

const Enmap = require('enmap');
const users = global.users = new Enmap({ name: 'users' });
const guilds = global.guilds = new Enmap({ name: "guilds" });

global.client = client;
global.version = package.version;
global.config = config;
global.commands = new discord.Collection;
global.util = new discord.Collection;

const DBL = require("dblapi.js");
const dbl = new DBL(config.dblToken, { webhookPort: 3031, webhookAuth: "BigLongStringThatShouldBeKeptSecret!GodForbidItGetsL34k3d,byH4X0R5!!!" }, client);
dbl.webhook.on('ready', hook => {
    console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
    console.log(vote)
    console.log(`User with ID ${vote.user} just voted!`);
    u = client.users.get(vote.user);
    if (u) u.send("Thank you for voting! - Xilog")
});


guilds.defer.then(() => {
    users.defer.then(() => {
        client.on('ready', () => {
            console.log(">>> Logged in as " + client.user.tag);
            client.user.setPresence({ game: { name: "myself boot up!", type: "WATCHING" }, status: "idle" })

            const dir = (d) =>
                fs.readdirSync(d)
                    .filter(f => f.endsWith('.js'))
                    .map(f => f.replace('.js', ''));

            const Commands = dir('./Cmds');
            Commands.forEach(c => {
                global.commands.set(c, require(`./Cmds/${c}`));
            });
                    
            const Events = dir('./Events');
            Events.forEach(e => {
                global.client.on(e, require(`./Events/${e}`));
            });

            const Util = dir('./Modules');
            Util.forEach(u => {
                global.util.set(u, require(`./Modules/${u}`));
            });


            // initialize dashboard
            require("./dashboard.js")(client, guilds)

            // change status to online
            client.user.setStatus("online")

            // intervals
            setInterval(() => changeStatus(), 15000);
            setInterval(() => unmute(client, guilds), 30000);
            setInterval(() => remind(client, users), 30000);
            setInterval(() => {
                dbl.postStats(client.guilds.size, client.shard.id, client.shard.total);
            }, 1800000);
        })
    })
})


let status = 0;
function changeStatus() {
    switch (status) {
        case 0:
            client.user.setActivity(`${client.guilds.size} servers`, { type: "WATCHING" });
            status++
            break;
        case 1:
            client.user.setActivity(`${client.users.size} users`, { type: "WATCHING" });
            status++
            break;
        default:
            client.user.setActivity(`v${client.version} ${config.guildConf.prefix}help`, { type: "LISTENING" });
            status = 0;
    }
}

function unmute(client, guilds) {
    guilds.forEach((val, k) => {
        if (!val || !val.mutes) return;
        for (let key in val.mutes) {
            let guildID = val.mutes[key].guild;
            let time = val.mutes[key].time;

            let guild = client.guilds.get(guildID);
            if (!guild) return delete val.mutes[key];
            let member = guild.members.get(key);
            let mutedRole = guild.roles.find(r => r.name === "Muted by Iris");

            if (Date.now() > time) {
                if (member && mutedRole && member.roles.get(mutedRole.id)) {
                    member.removeRole(mutedRole);
                    console.log(`Unmuted ${member.user.tag} in ${guild.name}`);
                }
                delete val.mutes[key];
            }
        }
    });
}

function remind(client, users) {
    users.forEach((val, k) => {
        if (!val) return;
        if (!val.reminders) val.reminders = {};
        for (key in val.reminders) {
            let time = val.reminders[key].time;
            let msg = val.reminders[key].msg;

            let user = client.users.get(k);
            if (!user) return delete val.reminders[key];

            if (Date.now() > time) {
                client.util.createEmbed({ title: "Here's your reminder!", desc: msg }).then(e => {
                    user.send(e).catch(e => console.log(e.stack));
                });
                delete val.reminders[key];
                console.log(`Reminded ${user.tag}.`)
            }

            users.set(k, val)
        }
    });
}



client.login(config.token)