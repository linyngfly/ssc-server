const EventEmitter = require('events').EventEmitter;
const messageService = require('../../net/messageService');
const constants = require('../../consts/constants');

class Player extends EventEmitter{
    constructor(opts){
        super();
        this._sid = opts.sid || '';
        this._uid = opts.uid || '';
        this._activeTime = Date.now();
        this._state = constants.PLAYER_STATE.ONLINE;
    }

    get state(){
        return this._state;
    }

    set state(value){
        this._state = value;
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

    get msgId(){
        return {
            sid:this._sid,
            uid:this._uid
        };
    }

    isOnline(){
        return this._state == constants.PLAYER_STATE.ONLINE;
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

    c_heartbeat(){
        this.updateActiveTime();
    }

}

module.exports = Player;