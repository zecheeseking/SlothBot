const Discord = require('discord.js');
module.exports.searchService = async function(message, searchResults, resultIndex, game) {
	return new Promise((resolve) => {
		const replyEmbed = new Discord.MessageEmbed()
			.setColor(0x91244e)
			.setAuthor('Search result for "' + game + '"', 'https://cdn.discordapp.com/app-icons/852456102502465565/0efcc65e28c18994c3191484a39c2c49.png?size=256');

		let prompt = `There are ${searchResults.length} results, please pick one:\n`;
		searchResults.every((value, index) => {
			prompt += `\n${(index + 1)}: ${value[resultIndex]}`;

			if (index > 19) {
				prompt += '\n...';
				return false;
			}
			return true;
		});

		message.channel.send('', replyEmbed.setDescription(prompt));

		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { time: 10000 });

		collector.on('collect', m => {
			const choice = Number.parseInt(m) - 1;
			if(typeof (searchResults[choice]) === 'undefined') {
				m.reply('', replyEmbed.setDescription(`${m} is out of range or invalid.`));
				return;
			}
			resolve(searchResults[choice]);
			collector.stop('CHOICE_MADE');
		});

		collector.on('end', (collection, endReason) => {
			if(endReason !== 'CHOICE_MADE') {
				message.reply('', replyEmbed.setDescription('No valid choice made within the alloted timeframe.'));
				resolve(null);
			}
		});
	});

};
