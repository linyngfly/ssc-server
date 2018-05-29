const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

class ReqHandler {
    constructor(entry) {
        this._entry = entry;
        this._checkMap = null;
    }

    set checkMap(value){
        this._checkMap = value;
    }

    _checkParam(route, msg){
        if(!this._checkMap) return;
        let params = this._checkMap.get(route);
        for(let i=0; i<params.length;params++){
            if(msg[params[i]] == null){
                throw ERROR_OBJ.PARAM_MISSING;
            }
        }
    }

    static getParams(protocol){
        let arr = Object.keys(protocol);
        if(arr.length > 0){
            return arr;
        }
    }

    static register(route) {
        let prototype = ReqHandler.prototype;
        prototype[route] = async function (msg, session, next) {
            msg.uid = msg.uid || session.uid;
            try{
                this._checkParam(route, msg);
                let [err, resp] = await this._entry.request(route, msg, session);
                utils.invokeCallback(next, err, resp || {Error:ERROR_OBJ.OK});
            }catch (err){
                utils.invokeCallback(next, null, {Error:err});
            }
        };
    }
}

module.exports = ReqHandler;