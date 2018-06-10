/**
 * http://www2.opencai.net/apifree/
 * 加拿大卑斯快乐8
 */

const SSC28BetParser = require('../ssc28BetParser');
const Ssc28OpenAwardCalc =require('../ssc28OpenAwardCalc');
const Canada28BonusPool = require('./canada28BonusPool');
const SSC = require('../ssc');
const config = require('../config');
const models = require('../../../models');
const OpenCaiNetApi = require('../openCaiNetApi');
const Canada28Player = require('./canada28Player');
// const Lucky28LimitRate = require('../lucky28LimitRate');

class Canada28 extends SSC{
    constructor(){
        super({
            gameIdentify:config.LUCKY28.GAME_IDENTIFY,
            hallName: config.CANADA28.MSG_CHANNEL_NAME,
            betParser:new SSC28BetParser(),
            bonusPool:new Canada28BonusPool({
                lotteryApi:new OpenCaiNetApi(config.OPEN_CAI_TYPE.CAKENO),
                openCaiType:config.OPEN_CAI_TYPE.CAKENO
            }),
            // lucky28LimitRate:new Lucky28LimitRate()
        });
    }

    start(){
        logger.error('CANADA28 start');
        // super.start();
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
        return new Canada28Player({uid: uid, sid: sid, account: account});
    }


}

module.exports = new Canada28();