const { quarantineFiltersService } = require('../services/quarantineFiltersService');
module.exports = {
	name: 'quarantine',
	description: 'Creates a thread and sets up automatic redirects for the specified game.',
	aliases: [],
    args: true,
	usage: '',
	async execute(message, args) {
        console.log(args);
		const game = args[0];
        const alias = args[1];
        quarantineFiltersService.addAlias(args[0], args[1]);
	},
};