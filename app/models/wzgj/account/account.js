const AccountCommit = require('./accountCommit');
const genRedisKey = require('../genRedisKey');
const accountModel = require('./accountModel');

class Account extends AccountCommit{
    constructor(uid){
        super();
        this.__uid = uid;
    }

    get uid() {
        return Number(this.__uid);
    }

    getFieldDef(field){
        return accountModel[field];
    }

    getKey(field){
        return genRedisKey.getPlayerKey(field);
    }

    getId(){
        return this.__uid;
    }

    static serialize(uid, data){
        let player = new Account(uid);
        for(let key in data){
            player.appendValue(key, data[key]);
        }
        return player;
    }
}

module.exports = Account;