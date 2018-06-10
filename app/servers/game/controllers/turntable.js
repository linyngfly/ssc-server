const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');


module.exports.turntable_draw = turntable_draw;


async function turntable_draw(data) {
    let game = omelo.app.entry.getGame(data.mainType, data.subType);
    if(game){
        let result = await game.getDraw(data);
        return logicResponse.ask(result);
    }
}