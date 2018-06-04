const logicResponse = require('../../common/logicResponse');

class Order{
    async recharge(data){
        return logicResponse.ask(data);
    }

    async cash(data){
        return logicResponse.ask(data);
    }
}

module.exports = new Order();