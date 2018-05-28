class Canada28{
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

module.exports = new Canada28();