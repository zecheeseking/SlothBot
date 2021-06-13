module.exports.searchService = async function(message, searchResults, resultIndex) {
	return new Promise((resolve) => {
		let prompt = `There are ${searchResults.length} results, please pick one:\n`;
		searchResults.every((value, index) => {
			prompt += `\n${(index + 1)}: ${value[resultIndex]}`;

			if (index === 19) {
				prompt += '\n...';
				return false;
			}
			return true;
		});

		message.channel.send(prompt);

		const filter = m => m.author.id === message.author.id;
		const collector = message.channel.createMessageCollector(filter, { time: 10000 });

		collector.on('collect', m => {
			const choice = Number.parseInt(m) - 1;
			if(typeof (searchResults[choice]) === 'undefined') {
				m.reply(`${m} is out of range or invalid.`);
				return;
			}
			resolve(searchResults[choice]);
			collector.stop('CHOICE_MADE');
		});

		collector.on('end', (collection, endReason) => {
			if(endReason !== 'CHOICE_MADE') {
				message.reply('No valid choice made within the alloted timeframe.');
				resolve(null);
			}
		});
	});

};
