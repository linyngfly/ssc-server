var pomelo = require('pomelo');

var EventManager = function () {

};

EventManager.prototype.addEvent = function (entity) {
    switch (entity.type) {
        case this.consts.EntityType.PLAYER :
            this.playerEvent.addEventForPlayer(entity);
            addPlayerSaveEvent(entity);
            break;
        case this.consts.EntityType.LOTTERY :
            this.lotteryEvent.addEventForNPC(entity);
            break;
        case this.consts.EntityType.ITEM :
            this.betItemEvent.addEventForBetItem(entity);
            addBetItemSaveEvent(entity);
            break;
    }
};

function addPlayerSaveEvent(player) {
    var app = pomelo.app;
    player.on('save', function () {
        app.get('sync').exec('playerSync.updatePlayer', player.id, player.strip());
    });

    // player.bets.on('save', function () {
    //     app.get('sync').exec('betSync.updateBet', player.bets.id, player.bets.getSyncItems());
    // });
    //
    // player.task.on('save', function () {
    //     app.get('sync').exec('taskSync.updateTask', player.task.id, player.task);
    // })
}

function addBetItemSaveEvent(betItem) {
    var app = pomelo.app;
    betItem.on('save', function () {
        app.get('sync').exec('betSync.updateBet', betItem.id, betItem.strip());
    });
}

module.exports = {
    id: "eventManager",
    func: EventManager,
    props: [
        {name: "consts", ref: "consts"},
        {name: "playerEvent", ref: "playerEvent"},
        {name: "lotteryEvent", ref: "lotteryEvent"},
        {name: "betItemEvent", ref: "betItemEvent"}
    ]
}

