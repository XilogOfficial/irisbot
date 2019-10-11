discord = require('discord.js');

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    if (!suffix[0] || suffix[0] == null || isNaN(suffix[0]) || suffix[0] > 1440 || suffix[0] < 0.1)
        return client.util.embed(message, {title:"Oops!", desc:"You must specify the number of hours later to remind you, between 0.1 and 1440 (60 days).", color:"red"})
    if (!suffix[1] || suffix[1] == null)
        return client.util.embed(message, {title:"Oops!", desc:"How about that, reminding yourself about nothing!", color:"red"})

    toRemind = message.author.id;
    let hours = suffix[0];

    reminder = {
        msg : suffix.join(" ").slice(suffix[0].length + 1),
        time: Math.round((new Date()).getTime()) + (hours * 3600000)
    };

    info = users.get(toRemind);
    let id = 1;

    if (isEmpty(info.reminders)) {
        info.reminders = {}
    } else {
        id = Object.size(info.reminders) + 1;
    }

    info.reminders[id] = reminder

    users.set(toRemind, info);
    client.util.embed(message, {title:"Done!", desc:`You will be reminded in ${hours} hours! (${hours*60} minutes)`, color:"green"})
}

Object.size = (obj) => {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

module.exports.help = {
    usage: "<hours later> <msg>",
    description: "Reminds you of something!",
    category: "utility"
}