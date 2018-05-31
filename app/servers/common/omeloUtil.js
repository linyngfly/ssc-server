const omelo = require('omelo');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ

class OmeloUtil{

    static async bind(session, uid){
        return new Promise(function (resolve, reject) {
            session.bind(uid, (err)=>{
                if(err){
                    logger.error('omeloUtil bind err=', err);
                    return reject(ERROR_OBJ.SYSTEM_ERROR);
                }
                resolve();
            });
        });
    }

    static async kick(uid, reason){
        let sessionService = omelo.app.get('sessionService');
        return new Promise(function (resolve) {
            sessionService.kick(uid,reason, ()=>{
                resolve();
            });
        });
    }

    /**
     * 设置session挂载数据
     * @param session
     * @param kvs {key:value,key1:value1}
     * @return {Promise.<void>}
     */
    static async set(session, kvs){
        return new Promise(function (resolve, reject) {
            for(let key in kvs){
                session.set(key, kvs[key]);
            }
            session.pushAll((err)=>{
                if(err){
                    logger.error('omeloUtil set err=', err);
                    return reject(ERROR_OBJ.SYSTEM_ERROR);
                }
                resolve();
            });
        });
    }
}

module.exports = OmeloUtil;

