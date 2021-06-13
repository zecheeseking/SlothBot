const Discord = require('discord.js');
const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();
const { searchService } = require('../services/searchService');

module.exports = {
	name: 'hltb',
	description: 'Shows times for a game from https://howlongtobeat.com/',
	aliases: ['howlongtobeat'],
	args: true,
	usage: '<name of game>',
	async execute(message, args) {
		const game = args.join(' ');
		if (game.length < 3) {
			return message.reply('Search query too short.');
		}

		const results = await hltbService.search(game)
			.catch(error => console.error(error));
		let result;

		if (results.length <= 0) {
			return message.reply(`No results for '${game}'.`);
		}
		if (results.length > 1) {
			result = await searchService(message, game, results);
		}
		if (results.length === 1) {
			result = results[0];
		}

		if (typeof (result) === 'undefined') {
			return message.reply('Unknown problem fetching the data from hltb.');
		}

		if (result === null) {
			return;
		}

		const timeFields = [];
		result.timeLabels.forEach(label => {
			let val = result[label[0]];
			if (val === 0) {
				val = ' - ';
			}
			else if (val % 1 === 0.5) {
				const full = Math.floor(val);
				val = `${full} ½ Hours`;
			}
			else {
				val = `${val} Hours`;
			}
			timeFields.push({
				name: label[1],
				value: `${val}`,
			});
		});

		const embed = new Discord.MessageEmbed()
			.setColor(0x91244e)
			.setAuthor(result.name, 'https://howlongtobeat.com' + result.imageUrl)
			.setDescription(`https://howlongtobeat.com/game.php?id=${result.id}`)
			.setThumbnail('https://howlongtobeat.com' + result.imageUrl);

		timeFields.map(field => {
			embed.addField(field.name, field.value);
		});

		message.reply('', embed);
	},
};
