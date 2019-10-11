const discord = require("discord.js");

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    guild = message.guild;

    let emotes = "";
    message.guild.emojis.forEach((val, k) => {
      emotes += val;
    });
    if (!emotes || emotes == null) emotes = "This server has no emotes.";

    let embed = new discord.RichEmbed()
        .setTitle(`Info for ${guild.name}`)
        .setColor(config.color)
        .setThumbnail(guild.iconURL)
        .addField(":camera: Avatar URL", guild.iconURL)
        .addField(":calendar_spiral: Server created", guild.createdAt.toUTCString(), true)
        .addField(":id: Guild ID", guild.id, true)
        .addField(":white_check_mark: Verification Level (1-5)", guild.verificationLevel + 1, true)
        .addField(":busts_in_silhouette: Members", `${guild.memberCount}`, true)
        .addField(":bust_in_silhouette: Owner", `${guild.owner.user.tag}`, true)
        .addField(":earth_africa: Server Region", `${guild.region}`, true)
        .addField(":b: Emotes", emotes, true)

    message.channel.send(embed);
}

module.exports.help = {
    usage: "",
    description: "Info about the server.",
    category: "utility"
}