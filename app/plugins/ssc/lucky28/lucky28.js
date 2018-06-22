/**
 * http://www2.opencai.net/apifree/
 * 北京快乐8
 * 9：00 ~ 23：55
 */

const SSC28BetParser = require('../ssc28BetParser');
const Ssc28OpenAwardCalc =require('../ssc28OpenAwardCalc');
const Lucky28Lottery = require('./lucky28Lottery');
const SSC = require('../ssc');
const config = require('../config');
const models = require('../../../models');
const OpenCaiNetApi = require('../openCaiNetApi');
const Lucky28Player = require('./lucky28Player');
const Lucky28LimitRate = require('./lucky28LimitRate');

class Lucky28 extends SSC{
    constructor(){
        super({
            gameIdentify:config.LUCKY28.GAME_IDENTIFY,
            hallName: config.LUCKY28.MSG_CHANNEL_NAME,
            betParser:new SSC28BetParser(),
            lottery:new Lucky28Lottery({
                lotteryApi:new OpenCaiNetApi(config.OPEN_CAI_TYPE.BJKL8),
                openCaiType:config.OPEN_CAI_TYPE.BJKL8
            }),
            betLimitRate:new Lucky28LimitRate()
        });
    }

    async start(){
        await super.start();
        logger.error('Lucky28 start');
    }

    async stop(){
        super.stop();
    }

    async _openAward(last){
        let openAwardCalc = new Ssc28OpenAwardCalc(last.numbers.split(','));
        openAwardCalc.calc();
        for(let player of this._playerMap.values()){
            await player.openAward(last.period, last.numbers, last.opentime, openAwardCalc);
            if(player.canRemove()){
                this._playerMap.delete(player.uid);
            }
        }
        return openAwardCalc.openResult;
    }

    async _createPlayer(uid, sid) {
        let account = await models.account.helper.getAccount(uid);
        return new Lucky28Player({uid: uid, sid: sid, account: account,limitRate:this._betLimitRate});
    }

}

module.exports = new Lucky28();