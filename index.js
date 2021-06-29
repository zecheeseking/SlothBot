require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const botCommands = require('./commands');
Object.keys(botCommands).map(key => {
	client.commands.set(botCommands[key].name, botCommands[key]);
});

const validations = require('./validations');

client.cooldowns = new Discord.Collection();

const allowedChannels = process.env.ALLOWED_CHANNEL_IDS.split(',');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	if (!message.content.startsWith(process.env.COMMAND_PREFIX)) return;

	const args = message.content.trim().split(/ +/);
	const commandName = args.shift().substring(1).toLowerCase();

	console.info(`Called command: ${commandName} ${args.join(' ')}`);

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (!validations.channel.validate(allowedChannels, message, commandName)) {
		return;
	}

	if (!validations.permission.validate(command.permissions, message)) {
		return;
	}

	if (!validations.args.validate(command, args, message)) {
		return;
	}

	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Discord.Collection());
	}
	if (!validations.cooldown.validate(client.cooldowns, command, message)) {
		return;
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.on('guildMemberUpdate', async (beforeUpdateMember, afterUpdateMember) => {
	if (!beforeUpdateMember.pending || afterUpdateMember.pending) return;

	console.log(`assigning ${afterUpdateMember.user.tag} Verified role...`);

	const verifiedRole = afterUpdateMember.guild.roles.cache.find(role => role.name === 'Verified');

	await afterUpdateMember.roles.add(verifiedRole);
});

client.login(process.env.TOKEN);
