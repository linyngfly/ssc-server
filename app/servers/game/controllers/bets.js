const logicResponse = require('../../common/logicResponse');

class Bets{
    async myBets(data){
        return logicResponse.ask(data);
    }
}

module.exports = new Bets();