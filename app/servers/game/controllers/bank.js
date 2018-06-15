const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');

class Bank{

    async bindPayInfo(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        let result = await game.bindPayInfo(data);
        return logicResponse.ask(result);
    }

    async getBankLog(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        let result = await game.getBankLog(data);
        return logicResponse.ask(result);
    }
}

module.exports = new Bank();