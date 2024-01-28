module.exports.quarantineFiltersService = {
    filtersList: [],
    addFilter(gameName, threadid){
        this.filtersList.push({
            game: gameName,
            alias: [],
            quarantineThreadid: threadid
        });
    },
    checkfilters(message){
        if(message.content.startsWith(process.env.COMMAND_PREFIX))
            return false;

        this.filtersList.forEach(filter => {
            if(message.content.includes(filter.game)){
                message.reply(`Oh no you've been a naughty impatient sinner UwU.`);
                return true;
            }

            filter.alias.forEach(alias => {
                if(message.content.includes(alias)){
                    message.reply(`Oh no you've been a naughty impatient sinner UwU.`);
                    return true;
                }
            })
        });

        return false;
    }
};