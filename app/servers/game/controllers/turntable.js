const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');
const constants = require('../../../consts/constants');

module.exports.turntable_draw = turntable_draw;


async function turntable_draw(data) {
    let game = omelo.entry.getGame(constants.PLUGINS.MAIN);
    if(game){
        let money = game.turntable.getDraw();
        if(money && money > 0){
            data.account.money = money;

        }
        return logicResponse.ask({
            money:data.account.money,
            award:money
        });
    }
}