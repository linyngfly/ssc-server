
const CQBetParser = require('./CQBetParser');
const Lottery = require('../lottery');
const OpenAwardCalc = require('./openAwardCalc');
const CQPlayer = require('./CQPlayer');
const SSC = require('../ssc');
const config = require('../config');
const models = require('../../../models');
const CQLotteryApi = require('./CQLotteryApi');
// const Lucky28LimitRate = require('./lucky28LimitRate');
class Cqssc extends SSC {
    constructor() {
        super({
            hallName: config.CQSSC.MSG_CHANNEL_NAME,
            betParser:new CQBetParser(),
            lottery:new Lottery({
                lotteryApi:new CQLotteryApi(config.OPEN_CAI_TYPE.CQSSC),
                openCaiType:config.OPEN_CAI_TYPE.CQSSC
            }),
            // lucky28LimitRate:new Lucky28LimitRate()
        });
    }

    start() {
        logger.error('CQSSC start');
        //super.start();
    }

    stop() {
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
        return new CQPlayer({uid: uid, sid: sid, account: account});
    }


}

module.exports = new Cqssc();