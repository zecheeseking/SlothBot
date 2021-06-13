module.exports = {
	validate(allowedChannels, message, commandName) {
		if (allowedChannels.includes(message.channel.id)) {
			return true;
		}

		console.log(`Command '${commandName}' not allowed in this channel`);
		return false;
	},
};