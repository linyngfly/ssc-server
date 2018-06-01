const Player = require('../player');
const models = require('../../../models');

class CQPlayer extends Player{
    constructor(opts){
        super(opts);
        this._betsMap = new Map();
        this._playerModel = opts.playerModel;
    }

    get playerModel(){
        return this._playerModel;
    }

    isBet(){
        return this._betsMap.size != 0;
    }

    canBet(){

    }

    async bet({period, identify, betData, parseRet}){
        await models.bet.helper.createBet(this.uid, {

        });
    }

    unBet(){

    }
}

module.exports = CQPlayer;