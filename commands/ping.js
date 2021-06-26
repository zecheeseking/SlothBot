module.exports = {
	name: 'ping',
	description: 'Checks if bot is logged in and working. Should reply.',
	aliases: [],
	usage: '',
	execute(message) {
		message.reply('Bow to the mighty $lothBot!');
	},
};