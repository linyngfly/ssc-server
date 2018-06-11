const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');

class GM {
    async getGMContactInfo(data) {
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        if(game){
            let result = await game.getGMInfo(data);
            return logicResponse.ask(result);
        }
    }
}

module.exports = new GM();