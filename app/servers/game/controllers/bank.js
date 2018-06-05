const logicResponse = require('../../common/logicResponse');

class Bank{

    _bindWechat(){

    }

    _bindAlipay(){

    }

    _bindCard(){

    }

    async bind(data){
        return logicResponse.ask(data);
    }
}

module.exports = new Bank();