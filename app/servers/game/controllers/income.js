const logicResponse = require('../../common/logicResponse');

class Income{
    async myIncome(data){
        return logicResponse.ask(data);
    }
}

module.exports = new Income();