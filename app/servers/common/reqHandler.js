const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;
const utils = require('../../utils/utils');

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
        if(!params) return;
        
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
                let err = null, resp = null;
                let ret = await this._entry.request(route, msg, session);
                if(ret){
                    if(ret instanceof Array){
                        let [_err, _resp] = ret;
                        if(_err && _err.code && _err.msg){
                            err = _err;
                            resp = _resp;
                        }else {
                            resp = ret;
                        }
    
                    }else {
                        resp = ret;
                    }
                }
                utils.invokeCallback(next, err, resp || {error:ERROR_OBJ.OK});
            }catch (err){
                utils.invokeCallback(next, null, {error:err});
            }
        };
    }
}

module.exports = ReqHandler;