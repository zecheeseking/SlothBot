module.exports = {
	name: 'ping',
	description: 'Checks if bot is logged in and working. Should reply with "pong".',
	aliases: [],
	usage: '',
	execute(message) {
		message.reply('pong');
	},
};