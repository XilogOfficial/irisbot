const embed = require('./createEmbed.js');

module.exports = async (m, title, desc) => {
    conf = guilds.get(m.guild.id);
    if (!conf) return;
    var today = new Date();

    e = embed({
        title: title,
        desc: desc,
        footer: today.toUTCString()
    })

    chn = m.guild.channels.get(conf.logs);
    if (chn) { chn.send(e) }
}