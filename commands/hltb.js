const Discord = require('discord.js');
const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();
const { searchService } = require('../services/searchService');

module.exports = {
	name: 'hltb',
	description: 'Shows times for a game from <https://howlongtobeat.com/>',
	aliases: ['howlongtobeat'],
	args: true,
	usage: '<name of game>',
	async execute(message, args) {
		const game = args.join(' ');

		const replyEmbed = new Discord.MessageEmbed()
			.setColor(0x91244e)
			.setAuthor('Search result for "'+game+'"', 'https://cdn.discordapp.com/app-icons/852456102502465565/0efcc65e28c18994c3191484a39c2c49.png?size=256');

		if (game.length < 3) {
			return message.reply('', replyEmbed.setDescription('Search query too short.'));
		}

		const results = await hltbService.search(game)
			.catch(error => console.error(error));
		let result;

		if (typeof (results) === 'undefined') {
			return message.reply('', replyEmbed.setDescription('Unknown problem fetching the data from hltb.'));
		}

		if (results.length <= 0) {
			return message.reply('', replyEmbed.setDescription('No results.'));
		}

		if (results.length > 1) {
			result = await searchService(message, results, 'name', game);
		}
		if (results.length === 1) {
			result = results[0];
		}

		if (typeof (result) === 'undefined' || result === null) {
			return message.reply('', replyEmbed.setDescription('Unknown problem fetching the data from hltb.'));
		}

		const resultEmbed = new Discord.MessageEmbed()
			.setColor(0x91244e)
			.setAuthor(result.name, 'https://cdn.discordapp.com/app-icons/852456102502465565/0efcc65e28c18994c3191484a39c2c49.png?size=256')
			.setDescription(`https://howlongtobeat.com/game.php?id=${result.id}`)
			.setThumbnail(result.imageUrl)
			.setFooter('Powered by HLTB');

		const timeFields = [
			{ name: result.timeLabels[0][0], value: result.gameplayMain },
			{ name: result.timeLabels[1][0], value: result.gameplayMainExtra },
			{ name: result.timeLabels[1][0], value: result.gameplayCompletionist }
		];

		timeFields.map(field => {
			resultEmbed.addField(field.name, field.value);
		});

		message.reply('', resultEmbed);
	},
};
