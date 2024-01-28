const { quarantineFiltersService } = require('../services/quarantineFiltersService');
module.exports = {
	name: 'quarantine',
	description: 'Creates a thread and sets up automatic redirects for the specified game.',
	aliases: [],
    args: true,
	usage: '',
	async execute(message, args) {

		const game = args.join(' ');
        const impatientChannel = await message.client.channels.fetch(process.env.IMPATIENT_CHANNEL_ID)
            .catch(error => console.log(error));

        if(typeof (impatientChannel) === 'undefined'){
			return message.reply('', replyEmbed.setDescription('Could not find impatient quarantine channel. did you set the ID?'));
        }

        await impatientChannel.threads.create({
            name: `${game}`,
            reason: `Quarantine thread for ${game}`,
        })
        .then(thread => {
            quarantineFiltersService.addFilter(`${game}`);
        })
        .catch(error => console.log(error));

		message.reply(`I will quarantine ${game} eventually!`);
	},
};