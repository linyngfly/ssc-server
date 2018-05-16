/**
 * Created by linyng on 17-6-20.
 */

//var instancePool = require('../../../domain/game/instancePool');
const logger = require('pomelo-logger').getLogger(__filename);
const bearcat = require('bearcat');

var AreaRemote = function (app) {
    this.app = app;
};

AreaRemote.prototype.create = function(params, cb){
    // var start = Date.now();
    // var result = instancePool.create(params);
    // var end = Date.now();
    // logger.info('create instance use time : %j', end - start);
    //
    // this.utils.invokeCallback(cb, null, result);
};

AreaRemote.prototype.close = function(params, cb){
    // var id = params.id;
    // var result = instancePool.close(id);
    //
    // this.utils.invokeCallback(cb, null, result);
};

module.exports = function (app) {
    return bearcat.getBean({
        id: "areaRemote",
        func: AreaRemote,
        args: [{
            name: "app",
            value: app
        }],
        props: [{
            name: "utils",
            ref: "utils"
        }, {
            name: "consts",
            ref: "consts"
        }]
    });
};