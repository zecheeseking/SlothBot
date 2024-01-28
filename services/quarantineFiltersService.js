module.exports.quarantineFiltersService = {
    filtersList: [],
    addFilter(gameName, threadid){
        this.filtersList.push({
            game: gameName,
            aliases: [],
            quarantineThreadid: threadid
        });
    },
    addAlias(game, alias){
        this.filtersList.forEach(filter => {
            if(filter.game === game){
                filter.alias.push(alias);
                return;
            }});
    },
    checkfilters(message){
        if(message.content.startsWith(process.env.COMMAND_PREFIX))
            return false;

        this.filtersList.forEach(filter => {
            if(message.content.includes(filter.game)){
                message.reply(`Oh no you've been a naughty impatient sinner UwU.`);
                return true;
            }

            filter.aliases.forEach(alias => {
                if(message.content.includes(alias)){
                    message.reply(`Oh no you've been a naughty impatient sinner UwU.`);
                    return true;
                }
            })
        });

        return false;
    }
};