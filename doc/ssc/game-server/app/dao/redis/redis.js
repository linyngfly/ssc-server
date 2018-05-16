/**
 * Created by linyng on 17-6-21.
 */

/**
 * Created by linyng on 2017/4/20.
 */
const redis = require('redis');
const logger = require('pomelo-logger').getLogger(__filename);
const Code = require('../../../../shared/code');

function RedisApi() {
    this._redis = null;
    this._pub_redis = null;
    this._sub_redis = null;
    this._callbacks ={};
};

RedisApi.prototype.init = function(configs, db){
    this.db = db || '0';
    this.configs = configs;
    this._redis = redis.createClient(configs.port, configs.host, {});
    if (configs.auth) {
        this._redis.auth(configs.auth);
    }

    var self = this;
    this._redis.on("error", function (err) {
        console.error('self.db:'+self.db+"[RedisSdk][_redis]" + err.stack);
    });

    this._redis.once('ready', function(err) {
        if (!!err) {
            cb(err);
        } else {
            self._redis.select(self.db, function (err,result) {
                logger.error(err,result);
            });
        }
    });
};

RedisApi.prototype.cmd = function(cmd, table, key, value, cb){
    let promise = new Promise((resolve, reject)=>{
        if(!cmd) {
            this.utils.invokeCallback(cb, Code.PARAMERROR);
            reject(Code.PARAMERROR);
            return;
        }

        let cmdItem =[];
        cmdItem.push(cmd);

        if(table){
            cmdItem.push(table);
        }

        if(key){
            cmdItem.push(key);
        }

        if(value){
            cmdItem.push(value);
        }

        let cmds = [];
        cmds.push(cmdItem);

        let self = this;
        this._redis.multi(cmds).exec(function(err, reply) {
            if(err){
                reject(Code.DBFAIL);
            }
            else {
                resolve(reply);
            }
            self.utils.invokeCallback(cb, err, reply);
        });
    });

    return promise;

};

RedisApi.prototype.pub = function(event, msg){

    if(!this._pub_redis)
    {
        this._pub_redis = redis.createClient(this.configs.port, this.configs.host, {});
        if (this.configs.auth) {
            this._pub_redis.auth(this.configs.auth);
        }
        this._pub_redis.on("error", function (err) {
            console.error('self.db:'+self.db+"[RedisSdk][_pub_redis]" + err.stack);
        });

        this._pub_redis.once('ready', function(err) {
            if (!!err) {
                cb(err);
                return;
            }
        });
    }

    if(this._pub_redis){
        this._pub_redis.publish(event, msg);
    }
};

RedisApi.prototype.sub = function (event, cb) {
    if(!this._sub_redis){
        this._sub_redis = redis.createClient(this.configs.port, this.configs.host, {});
        if (this.configs.auth) {
            this._sub_redis.auth(this.configs.auth);
        }

        this._sub_redis.on("error", function (err) {
            console.error('self.db:'+self.db+"[RedisSdk][_sub_redis]" + err.stack);
        });

        let self = this;
        this._sub_redis.once('ready', function(err) {
            if (!!err) {
                cb(err);
            } else {
                self._sub_redis.on('message', function (event, msg) {
                    self._callbacks[event](JSON.parse(msg));
                });
            }
        });
    }

    if(this._sub_redis){
        this._sub_redis.subscribe(event);
        this._callbacks[event] = cb;
    }
};

RedisApi.shutdown = function(){
    if(this._redis) {
        this._redis.end();
        this._redis = null;
    }

    if(this._sub_redis) {
        this._sub_redis.end();
        this._sub_redis = null;
    }

    if(this._pub_redis) {
        this._pub_redis.end();
        this._pub_redis = null;
    }
};

module.exports ={
    id:'redisApi',
    func:RedisApi,
    props:[
        {name:'utils', ref:'utils'}
    ]
}












