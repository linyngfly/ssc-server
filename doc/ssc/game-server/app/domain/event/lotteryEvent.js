var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger(__filename);

var LotteryEvent = function () {
};

LotteryEvent.prototype.addEventForNPC = function (lottery){
    var self = this;
    /**
     * Publish the lottery tick free seconds.
     */
	lottery.on(this.consts.Event.area.countdown, function (args) {
      //  var lottery = self.getEntity(args.entityId);
        if (args.lottery) {
            args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.countdown,{
                entityId: args.lottery.entityId,
                tickCount: Math.floor(args.lottery.tickCount),
                period:args.lottery.tickPeriod
            });
        }
    });

    /**
     * Publish the lottery result
     */
	lottery.on(this.consts.Event.area.lottery, function (args) {
        if (args.lottery) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(self.consts.Event.area.lottery,{
                    entityId: args.lottery.entityId,
                    lotteryResult: args.lotteryResult,
                    preLottery:args.preLottery
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.lottery,{
                    entityId: args.entityId,
                    lotteryResult: args.lotteryResult,
                    preLottery:args.preLottery
                });
            }
        }
    });

	lottery.on(this.consts.Event.area.notice, function(args){
        if (args.lottery) {
            args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.notice,{
                entityId: args.lottery.entityId,
                notice: args.content,
            });
        }
	});

	lottery.on(this.consts.Event.area.parseLottery, function(args){
        if (args.lottery) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(self.consts.Event.area.parseLottery,{
                    entityId: args.lottery.entityId,
                    parseResult: args.parseResult,
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.parseLottery,{
                    entityId: args.lottery.entityId,
                    parseResult: args.parseResult,
                });
            }
        }
	});

    lottery.on(this.consts.Event.area.playerBets, function(args) {
        var betItems = [];
        for(var i = 0; i<args.betItems.length;i++){
            betItems.push(args.betItems[i]);
        }
        if (args.lottery) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(self.consts.Event.area.playerBets,{
                    entityId: args.lottery.entityId,
                    betItems: betItems,
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.playerBets,{
                    entityId: args.lottery.entityId,
                    betItems: betItems,
                });
            }
        }
    });
};

module.exports ={
	id:"lotteryEvent",
	func:LotteryEvent,
	props:[
		{name:"consts", ref:"consts"}
	]
}
