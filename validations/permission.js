module.exports = {
	validate(permissions, msg) {
		if (permissions) {
			const authorPerms = msg.channel.permissionsFor(msg.author);
			if (!authorPerms || !authorPerms.has(permissions)) {
				msg.reply('You don\'t have the permission!');

				return false;
			}
		}

		return true;
	},
};