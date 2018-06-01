const BetCommit = require('./betCommit');
const genRedisKey = require('../genRedisKey');
const betModel = require('./betModel');

class Bet extends BetCommit{
    constructor(uid){
        super();
        this.__uid = uid;
    }

    get uid() {
        return Number(this.__uid);
    }

    getFieldDef(field){
        return betModel[field];
    }

    getKey(field){
        return genRedisKey.getPlayerKey(field);
    }

    getId(){
        return this.__uid;
    }

    static serialize(uid, data){
        let Bet = new Bet(uid);
        for(let key in data){
            Bet.appendValue(key, data[key]);
        }
        return Bet;
    }
}

module.exports = Bet;