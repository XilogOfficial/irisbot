const discord = require("discord.js");

// Responses according to the official Mattel Magic 8-ball. 20 total
responses = [
    "It is certain", //10 positive
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again", //5 non-commital
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it", //5 negative
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

module.exports.run = async (message, suffix, client, config, guilds, users) => {
    question = suffix.join(" ");

    if (!question)
        return client.util.embed(message, {title:"Oops!", desc:"You must ask something of the Magic 8-ball!", color:"red"});

    embed = new discord.RichEmbed()
        .setDescription(`${responses[Math.floor(Math.random() * responses.length)]}`)
        .setColor(config.color)

    if (question.length < 128)
        embed.setAuthor(question, message.author.avatarURL).setTitle(":8ball: 8ball says")
    else
        embed.setAuthor(":8ball: 8ball says", message.author.avatarURL)
    
    message.channel.send(embed)
}

module.exports.help = {
    usage: "<question>",
    description: "Ask a question of the Magic 8-ball!",
    category: "fun"
}