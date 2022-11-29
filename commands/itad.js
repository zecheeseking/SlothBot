const Discord = require('discord.js');
const axios = require('axios');
const { searchService } = require('../services/searchService');

module.exports = {
	name: 'itad',
	description: 'Shows current deals from <https://isthereanydeal.com/>.',
	aliases: ['isthereanydeal'],
	args: true,
	usage: '[au, br, ca, cn, eu1, eu2, ru, tr, uk, us] <name of game>',
	async execute(message, args) {
		const possibleRegions = ['eu1', 'eu2', 'au', 'br', 'ca', 'cn', 'ru', 'tr', 'uk', 'us'];

		let region = possibleRegions[0];
		let game = args.join(' ');

		if (possibleRegions.includes(args[0])) {
			region = args[0];
			game = args.slice(1).join(' ');
		}

		const replyEmbed = new Discord.MessageEmbed()
			.setColor(0x91244e)
			.setAuthor('Search result for "' + game + '"', 'https://cdn.discordapp.com/app-icons/852456102502465565/0efcc65e28c18994c3191484a39c2c49.png?size=256');

		if (game.length < 3) {
			return message.reply('', replyEmbed.setDescription('Search query too short.'));
		}

		const searchResults = await axios.get(`https://api.isthereanydeal.com/v02/search/search/?key=${process.env.ITAD_APIKEY}&q=${game}&limit=21strict=0`)
			.catch(error => console.error(error));

		const entries = searchResults.data.data.results;

		let result;
		if (entries.length <= 0) {
			return message.reply('', replyEmbed.setDescription('No results.'));
		}
		if (entries.length > 1) {
			result = await searchService(message, entries, 'title', game);
		}
		if (entries.length === 1) {
			result = result.data[0];
		}

		if(typeof (result) === 'undefined') {
			return message.reply('', replyEmbed.setDescription('Unknown problem fetching the data from ITAD.'));
		}

		if (result === null) {
			return;
		}

		const priceResults = await axios.get(`https://api.isthereanydeal.com/v01/game/overview/?key=${process.env.ITAD_APIKEY}&plains=${result.plain}&region=${region}`)
			.catch(error => console.error(error));

		const entry = priceResults.data.data[result.plain];

		const resultEmbed = new Discord.MessageEmbed()
			.setColor(0x91244e)
			.setAuthor(result.title, 'https://cdn.discordapp.com/app-icons/852456102502465565/0efcc65e28c18994c3191484a39c2c49.png?size=256')
			.setDescription(entry.urls.info)
			.addField('Price', entry.price.price_formatted, true)
			.addField('Discount', entry.price.cut + '%', true)
			.addField('Store', entry.price.store, true)
			// .addField('DRM', '\u200B' + entry.price.drm.join(', '), true)
			.addField('URL', entry.price.url, false)
			// .addField('\u200B', '\u200B')
			.addField('Historical Low', entry.lowest.price_formatted, false)
			.addField('Discount', entry.lowest.cut + '%', true)
			.addField('Store', entry.lowest.store, true)
			.addField('Recorded', entry.lowest.recorded_formatted, true)
			.setFooter('Powered by ITAD');

		message.reply('', resultEmbed);
	},
};
