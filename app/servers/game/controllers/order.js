const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');

class Order{
    async recharge(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        return logicResponse.ask(game.recharge(data));
    }

    async cash(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        return logicResponse.ask(game.cash(data));
    }
}

module.exports = new Order();