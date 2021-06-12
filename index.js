require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
	client.commands.set(process.env.COMMAND_PREFIX + botCommands[key].name, botCommands[key]);
});

client.cooldowns = new Discord.Collection();

const allowedChannels = process.env.ALLOWED_CHANNEL_IDS.split(',');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (!msg.content.startsWith(process.env.COMMAND_PREFIX)) return;

	const args = msg.content.trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	console.info(`Called command: ${commandName}`);

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!validateChannel(msg)) {
		return;
	}

	if (!validatePermission(command, msg)) {
		return;
	}

	if (!validateArgs(command, args, msg)) {
		return;
	}

	if (!validateCooldown(client.cooldowns, command, msg)) {
		return;
	}

	try {
		command.execute(msg, args);
	}
	catch (error) {
		console.error(error);
		msg.reply('There was an error trying to execute that command!');
	}
});

client.login(process.env.TOKEN);


function validateChannel(msg) {
	if (allowedChannels.includes(msg.channel.id)) {
		return true;
	}

	console.log('Command not allowed in this channel');
	return false;
}

function validatePermission(command, msg) {
	if (command.permissions) {
		const authorPerms = msg.channel.permissionsFor(msg.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			msg.reply('You don\'t have the permission!');

			return false;
		}
	}

	return true;
}

function validateArgs(command, args, msg) {
	if (command.args && !args.length) {
		let reply = 'You didn\'t provide any arguments!';
		if (command.usage) {
			reply += `\nThe proper usage would be: '${process.env.COMMAND_PREFIX}${command.name} ${command.usage}'.`;
		}
		msg.reply(reply);

		return false;
	}

	return true;
}

function validateCooldown(cooldowns, command, msg) {
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

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
}