const PlayerCommit = require('./playerCommit');
const genRedisKey = require('../genRedisKey');
const playerModel = require('./playerModel');

class Player extends PlayerCommit{
    constructor(uid){
        super();
        this.__uid = uid;
    }

    get uid() {
        return Number(this.__uid);
    }

    getFieldDef(field){
        return playerModel[field];
    }

    getKey(field){
        return genRedisKey.getPlayerKey(field);
    }

    getId(){
        return this.__uid;
    }

    static serialize(uid, data){
        let player = new Player(uid);
        for(let key in data){
            player.appendValue(key, data[key]);
        }
        return player;
    }
}

module.exports = Player;