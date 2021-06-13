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

		if (game.length < 3) {
			return message.reply('Search query too short.');
		}

		const searchResults = await axios.get(`https://api.isthereanydeal.com/v02/search/search/?key=${process.env.ITAD_APIKEY}&q=${game}&limit=21strict=0`)
			.catch(error => console.error(error));

		const entries = searchResults.data.data.results;

		let result;
		if (entries.length <= 0) {
			return message.reply(`No results for '${game}'.`);
		}
		if (entries.length > 1) {
			result = await searchService(message, entries, 'title');
		}
		if (entries.length === 1) {
			result = result.data[0];
		}

		if(typeof (result) === 'undefined') {
			return message.reply('Unknown problem fetching the data from IGDB.');
		}

		if (result === null) {
			return;
		}

		const priceResults = await axios.get(`https://api.isthereanydeal.com/v01/game/overview/?key=${process.env.ITAD_APIKEY}&plains=${result.plain}&region=${region}`)
			.catch(error => console.error(error));

		const entry = priceResults.data.data[result.plain];

		const embed = new Discord.MessageEmbed()
			.setColor(0x91244e)
			.setAuthor(result.title)
			.setDescription(entry.urls.info)
			.addField('Best Deal:', '\u200B', false)
			.addField('Price', entry.price.price_formatted, true)
			.addField('Discount', entry.price.cut + '%', true)
			.addField('Store', entry.price.store, true)
			.addField('DRM', '\u200B' + entry.price.drm.join(', '), true)
			.addField('URL', entry.price.url, true)
			.addField('Historical Low:', '\u200B', false)
			.addField('Price', entry.lowest.price_formatted, true)
			.addField('Discount', entry.lowest.cut + '%', true)
			.addField('Store', entry.lowest.store, true)
			.addField('Recorded on', entry.lowest.recorded_formatted, true)
			.setFooter('Powered by ITAD');

		message.reply('', embed);
	},
};
