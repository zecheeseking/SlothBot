module.exports = {
	validate(command, args, message) {
		if (command.args && !args.length) {
			let reply = 'You didn\'t provide any arguments!';
			if (command.usage) {
				reply += `\nThe proper usage would be: '${process.env.COMMAND_PREFIX}${command.name} ${command.usage}'.`;
			}
			message.reply(reply);

			return false;
		}

		return true;
	},
};