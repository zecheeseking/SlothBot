const { quarantineFiltersService } = require('../services/quarantineFiltersService');
module.exports = {
	name: 'addalias',
	description: 'Adds an additional alias that will trigger the filter if mentioned in a message.',
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