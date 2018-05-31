const Player = require('../player');
const models = require('../../../models');

class CQPlayer extends Player{
    constructor(opts){
        super(opts);
        this._betsMap = new Map();
    }

    isBet(){
        return this._betsMap.size != 0;
    }

    canBet(){

    }

    async bet(period, identify, betData, parseRet){
        await models.player.helper.getPlayer(this.uid, apiCfg.accountFields);
    }

    unBet(){

    }
}

module.exports = CQPlayer;