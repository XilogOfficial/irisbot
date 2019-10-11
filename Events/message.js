module.exports = (ctx, x) => {
    if (ctx.content.includes(client.token))
        ctx.delete();
    
    if (ctx.channel.type !== "text") return;
    if (!guilds.get(ctx.guild.id)) guilds.set(ctx.guild.id, config.guildConf)
    if (ctx.author.bot) return;

    if (!users.get(ctx.author.id)) users.set(ctx.author.id, config.userConf)
    
    // --COMMANDS--
    if (ctx.content.startsWith(guilds.get(ctx.guild.id).prefix)) {
        var suffix = ctx.content.replace(guilds.get(ctx.guild.id).prefix, '').trim().split(' ');
        suffix.shift();
        var cmd = ctx.content.replace(guilds.get(ctx.guild.id).prefix, '').trim().split(' ')[0].toLowerCase();
        
        let command = commands.get(cmd);
        if (command) {
            command.run(ctx, suffix)
            console.log(`${cmd} ${suffix.join(" ")} run by ${ctx.author.tag} in ${ctx.guild.name}`)
        }
    }
}