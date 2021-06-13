module.exports = {
	validate(allowedChannels, msg, commandName) {
		if (allowedChannels.includes(msg.channel.id)) {
			return true;
		}

		console.log(`Command ${commandName} not allowed in this channel`);
		return false;
	},
};