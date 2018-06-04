/**
 * http://www2.opencai.net/apifree/
 * 北京快乐8
 * 9：00 ~ 23：55
 */

const Ssc28BetParser = require('../ssc28BetParser');
const Ssc28OpenAwardCalc =require('../ssc28OpenAwardCalc');
const Lucky28BonusPool = require('./lucky28BonusPool');
const SscHall = require('../sscHall');
const config = require('../config');
const models = require('../../../models');
const OpenCaiNetApi = require('../openCaiNetApi');
const Lucky28Player = require('./lucky28Player');

class Lucky28 extends SscHall{
    constructor(){
        super({
            msgChannelName: config.LUCKY28.MSG_CHANNEL_NAME,
            betParser:new Ssc28BetParser(),
            bonusPool:new Lucky28BonusPool({
                lotteryApi:new OpenCaiNetApi(config.OPEN_CAI_TYPE.BJKL8),
                openCaiType:config.OPEN_CAI_TYPE.BJKL8
            })
        });
    }

    start(){
        logger.error('CANADA28 start');
        super.start();
    }

    stop(){
        super.stop();
    }

    async _openAward(last){
        let openAwardCalc = new Ssc28OpenAwardCalc(last.numbers.split(','));
        let openResult = openAwardCalc.calc();
        for(let player of this._playerMap.values()){
            await player.openAward(last.period, last.numbers, openResult);
        }
    }

    async _createPlayer(uid, sid) {
        let account = await models.account.helper.getAccount(uid);
        return new Lucky28Player({uid: uid, sid: sid, account: account});
    }


}

module.exports = new Lucky28();