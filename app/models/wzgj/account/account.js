const AccountCommit = require('./accountCommit');
const genRedisKey = require('../genRedisKey');
const accountModel = require('./accountModel');

class Account extends AccountCommit{
    constructor(uid){
        super();
        this._id = uid;
    }

    get uid() {
        return this._id;
    }

    getId(){
        return this._id;
    }

    getFieldDef(field){
        return accountModel[field];
    }

    getKey(field){
        return genRedisKey.getAccountKey(field);
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