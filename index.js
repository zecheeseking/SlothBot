require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const botCommands = require('./commands');
Object.keys(botCommands).map(key => {
	client.commands.set(process.env.COMMAND_PREFIX + botCommands[key].name, botCommands[key]);
});

const validations = require('./validations');

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

	if (!validations.channel.validate(allowedChannels, msg, commandName)) {
		return;
	}

	if (!validations.permission.validate(command.permissions, msg)) {
		return;
	}

	if (!validations.args.validate(command, args, msg)) {
		return;
	}

	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Discord.Collection());
	}
	if (!validations.cooldown.validate(client.cooldowns, command, msg)) {
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
