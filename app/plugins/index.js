
let loadGames = ['wzgj','cqssc'];

loadGames.forEach(function(item){
    module.exports[item] = require('./' + item);
});