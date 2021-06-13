module.exports = {
	validate(cooldowns, command, message) {
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || process.env.DEFAULT_COOLDOWN) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before reusing the '${command.name}' command.`);

				return false;
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		return true;
	},
};