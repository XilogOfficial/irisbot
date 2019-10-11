module.exports = (guild, x, client, config, guilds, users) => {
    guilds.set(guild.id, config.defaultConf);
    console.log(`+++Added to ${guild.name}!`)
}