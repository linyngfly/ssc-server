const EventEmitter = require('events').EventEmitter;
const messageService = require('../../net/messageService');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

class Player extends EventEmitter{
    constructor(opts){
        super();
        this._opts = opts;
        this._kindId = opts.kindId;
        this._sid = opts.sid || '';
        this._uid = opts.uid || '';
        this._activeTime = Date.now();
        this._ready = false;
    }
    get ready(){
        return this._ready;
    }
    set ready(r){
        this._ready = r;
    }

    get opts(){
        return this._opts;
    }

    get kindId(){
        return this._kindId;
    }

    get uid(){
        return this._uid;
    }

    get sid(){
        return this._sid;
    }

    set sid(value){
        this._sid = value;
    }

    send(route, msg){
        messageService.send(route, msg, {uid: this._uid, sid: this._sid});
    }

    get activeTime(){
        return this._activeTime;
    }

    updateActiveTime(){
        this._activeTime = Date.now();
    }

    c_heartbeat(data, cb){
        this.updateActiveTime();
        utils.invokeCallback(cb, null, ERROR_OBJ.OK);
    }

}

module.exports = Player;