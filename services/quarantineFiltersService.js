module.exports.quarantineFiltersService = {
    filtersList: [],
    addFilter(gameName){
        this.filtersList.push(gameName);
    },
};