const logicResponse = require('../../common/logicResponse');
const omelo = require('omelo');

class GM {
    async getGMContactInfo(data) {
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        let result = await game.getGMInfo(data);
        return logicResponse.ask(result);
    }

    async setOrderState(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        return logicResponse.ask(await game.setOrderState(data));
    }

    async setPlayerInfo(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        let result = await game.setPlayerInfoByGM(data);
        return logicResponse.ask(result);
    }

    async getBroadcast(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        let result = await game.getBroadcast(data);
        return logicResponse.ask(result);
    }

    async setBroadcast(data){
        let game = omelo.app.entry.getGame(data.mainType, data.subType);
        let result = await game.setBroadcast(data);
        return logicResponse.ask(result);
    }
}

module.exports = new GM();