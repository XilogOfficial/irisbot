const conf = require('./config.js');

const { ShardingManager } = require('discord.js');
const shardman = new ShardingManager("bot.js", { token: conf.token });

shardman.spawn(1); //spawn 1 shard for now