module.exports = {
	validate(cooldowns, command, msg) {
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(msg.author.id)) {
			const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				msg.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before reusing the '${command.name}' command.`);

				return false;
			}
		}

		timestamps.set(msg.author.id, now);
		setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

		return true;
	},
};