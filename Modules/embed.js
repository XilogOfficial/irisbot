const embed = require('./createEmbed.js');

module.exports = async (m, c) => {
    return embed(c).then(e => m.channel.send(e));
}