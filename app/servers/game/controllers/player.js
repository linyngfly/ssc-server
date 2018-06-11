const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');

async function setPlayerInfo(data){
    let game = omelo.app.entry.getGame(data.mainType, data.subType);
    if(game){
        let result = await game.setPlayerInfo(data);
        return logicResponse.ask(result);
    }
}

module.exports.setPlayerInfo = setPlayerInfo;