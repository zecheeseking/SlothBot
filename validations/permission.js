module.exports = {
	validate(permissions, message) {
		if (permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(permissions)) {
				message.reply('You don\'t have the permission!');

				return false;
			}
		}

		return true;
	},
};