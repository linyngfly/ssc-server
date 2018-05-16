
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var PlayerEvent = function () {

};

PlayerEvent.prototype.addEventForPlayer = function (player){
    var self = this;
    player.on(this.consts.Event.area.playerBet, function(args) {
        var player = args.player;
        if (player) {
            var betItem = args.betItem.strip();
            player.gameService.broadcastMessage(self.consts.Event.area.playerBet,{
                entityId:player.entityId,
                betItem: betItem
            });
        }
    });

    player.on(this.consts.Event.area.playerUnBet, function(args) {
        var player = args.player;
        if (player) {
            var betItem = args.betItem.strip();
            player.gameService.broadcastMessage(self.consts.Event.area.playerUnBet,{
                entityId:player.entityId,
                betItem: betItem
            });
        }
    });

    player.on(this.consts.Event.area.playerChange, function(args) {
        var player = args.player;
        if (player) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(self.consts.Event.area.playerChange,{
                    entityId:player.entityId,
                    player: player.strip()
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.playerChange,{
                    entityId:player.entityId,
                    player: player.strip()
                });
            }
        }
    });

    player.on(this.consts.Event.area.playerWinner, function(args) {
        var player = args.player;
        if (player) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(self.consts.Event.area.playerWinner,{
                    entityId:player.entityId,
                    winMoney: args.winMoney,
                    itemOK:args.itemOK,
                    numbers: args.numbers
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.playerWinner,{
                    entityId:player.entityId,
                    winMoney: args.winMoney,
                    itemOK:args.itemOK,
                    numbers: args.numbers
                });
            }
        }
    });

    player.on(this.consts.Event.area.playerPreWinner, function(args) {
        var player = args.player;
        if (player) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(self.consts.Event.area.playerPreWinner,{
                    entityId:player.entityId,
                    itemOK:args.itemOK
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.playerPreWinner,{
                    entityId:player.entityId,
                    itemOK:args.itemOK
                });
            }
        }
    });

    player.on(this.consts.Event.area.defineNotify, function(args) {
        var player = args.player;
        if (player) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(this.consts.Event.area.defineNotify,{
                    entityId:player.entityId,
                    type: args.type,
                    msg:args.msg
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(this.consts.Event.area.defineNotify,{
                    entityId:player.entityId,
                    type: args.type,
                    msg:args.msg
                });
            }
        }
    });
};

module.exports = {
	id:"playerEvent",
	func:PlayerEvent,
	props:[
		{name:"consts",ref:"consts"}
	]

}