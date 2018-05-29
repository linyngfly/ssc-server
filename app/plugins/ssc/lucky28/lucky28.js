/**
 * 北京快乐8
 * 开奖20位数字：04,06,09,10,15,20,26,31,33,34,40,45,54,65,69,74,75,76,77,79
 * 按大小排列
 * 1~6位相加和值末位数作为幸运28第一个数字
 * 7~12 第二个数字
 * 13~18第三个数字
 */

class Lucky28{
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

module.exports = new Lucky28();