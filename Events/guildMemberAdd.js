module.exports = (member, x, client, config, guilds, users) => {
    const guild = member.guild;
    const conf = guilds.get(guild.id);
    if (!conf) return;
    chn = guild.channels.get(conf.channelJoin);

   const msg = conf.msgJoin.replace("[[user]]", member.user.username);

    if (!chn || chn == null) return;
    if (!chn.permissionsFor(guild.client.user).has("SEND_MESSAGES")) return;

    embed = client.createEmbed({ title:"Welcome!", desc:msg })

    try {
        chn.send(embed)
    } catch(e) {
        console.log(e.stack);
    }
}