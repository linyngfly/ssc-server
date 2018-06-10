const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');

class Order{
    async recharge(data){
        let game = omelo.app.entry.getGame(data.mainType);
        if(game){
            game.HALL.
        }
        return logicResponse.ask(data);
    }

    async cash(data){
        return logicResponse.ask(data);
    }
}

module.exports = new Order();