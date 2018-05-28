const ERROR_OBJ = require('../../../consts/error_code').ERROR_OBJ;

class Cqssc{
    constructor(){

    }

    start(){

    }

    stop(){

    }

    async request(route, msg, session){
        if(!this[route]){
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        this[route](msg, session);
    }

    async rpc(method, msg){
        if(!this[method]){
            throw ERROR_OBJ.NOT_SUPPORT_SERVICE;
        }
        this[method](msg);
    }

    c_bet(msg, session){

    }

    c_unBet(msg, session){

    }
}

module.exports = Cqssc;