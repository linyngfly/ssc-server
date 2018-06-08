const BetCommit = require('./betCommit');
const genRedisKey = require('../genRedisKey');
const betModel = require('./betModel');

class Bet extends BetCommit{
    constructor(id){
        super();
        this._id = id;
    }

    get uid() {
        return Number(this._id);
    }

    getId(){
        return this._id;
    }

    getFieldDef(field){
        return betModel[field];
    }

    getKey(field){
        return genRedisKey.getBetKey(field);
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