/**
 * http://www2.opencai.net/apifree/
 * 加拿大卑斯快乐8
 */

const SSC28BetParser = require('../ssc28BetParser');
const Ssc28OpenAwardCalc = require('../ssc28OpenAwardCalc');
const Canada28Lottery = require('./canada28Lottery');
const SSC = require('../ssc');
const config = require('../config');
const models = require('../../../models');
const OpenCaiNetApi = require('../openCaiNetApi');
const Canada28Player = require('./canada28Player');
const Canada28LimitRate = require('./canada28LimitRate');

class Canada28 extends SSC {
    constructor() {
        super({
            gameIdentify: config.CANADA28.GAME_IDENTIFY,
            hallName: config.CANADA28.MSG_CHANNEL_NAME,
            betParser: new SSC28BetParser(),
            lottery: new Canada28Lottery({
                lotteryApi: new OpenCaiNetApi(config.OPEN_CAI_TYPE.CAKENO),
                openCaiType: config.OPEN_CAI_TYPE.CAKENO
            }),
            betLimitRate: new Canada28LimitRate()
        });
    }

    async start() {
        await super.start();
        logger.error('Canada28 start');
    }

    async stop() {
        super.stop();
    }

    async _openAward(last) {
        let openAwardCalc = new Ssc28OpenAwardCalc(last.numbers.split(','));
        let openResult = openAwardCalc.calc();
        for (let player of this._playerMap.values()) {
            await player.openAward(last.period, last.numbers, last.opentime, openResult);
            if(player.canRemove()){
                this._playerMap.delete(player.uid);
            }
        }
        return openResult;
    }

    async _createPlayer(uid, sid) {
        let account = await models.account.helper.getAccount(uid);
        return new Canada28Player({uid: uid, sid: sid, account: account, limitRate:this._betLimitRate});
    }


}

module.exports = new Canada28();