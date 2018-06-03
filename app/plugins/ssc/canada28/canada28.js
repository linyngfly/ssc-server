/**
 * http://www2.opencai.net/apifree/
 * 加拿大卑斯快乐8
 */

const Ssc28BetParser = require('../ssc28BetParser');
const OpenAwardCalc =require('../cqssc/OpenAwardCalc');
const BonusPool = require('../bonusPool');
const SscHall = require('../sscHall');
const config = require('../config');
const models = require('../../../models');
const OpenCaiNetApi = require('../openCaiNetApi');
const Canada28Player = require('./canada28Player');

class Canada28 extends SscHall{
    constructor(){
        super({
            msgChannelName: config.CANADA28.MSG_CHANNEL_NAME,
            betParser:new Ssc28BetParser(),
            bonusPool:new BonusPool({
                lotteryApi:new OpenCaiNetApi(config.OPEN_CAI_TYPE.CAKENO),
                openCaiType:config.OPEN_CAI_TYPE.CAKENO
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
        let openAwardCalc = new OpenAwardCalc(last.numbers.split(','));
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