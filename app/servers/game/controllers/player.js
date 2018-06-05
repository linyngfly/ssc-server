const logicResponse = require('../../common/logicResponse');

class Player{
    _setNickname(){

    }

    _setHeadImg(){

    }

    async set(data){
        return logicResponse.ask(data);
    }
}

module.exports = new Player();