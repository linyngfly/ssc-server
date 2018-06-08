const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');
const logBuilder = require('../../../utils/logSync/logBuilder');
const models = require('../../../models');

module.exports.turntable_draw = turntable_draw;


async function turntable_draw(data) {
    let game = omelo.app.entry.getGame(data.mainType);
    if(game){
        let money = game.HALL.turntable.getDraw();
        if(money && money > 0){
            data.account.money = money;
            await data.account.commit();

            logBuilder.addMoneyLog({
                uid:data.uid,
                gain:money,
                total:data.account.money,
                scene:models.constants.GAME_SCENE.TURNTABLE
            });
        }

        return logicResponse.ask({
            money:data.account.money,
            award:money
        });
    }
}