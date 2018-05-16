var pomelo = require('pomelo');

var BetItemEvent = function () {

};

/**
 * Handler lottery event
 */
BetItemEvent.prototype.addEventForBetItem = function (betItem){
    var self = this;
    /**
     * Publish the lottery tick free seconds.
     */
    betItem.on(this.consts.Event.area.countdown, function (args) {
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
    betItem.on(this.consts.Event.area.lottery, function (args) {
        if (args.lottery) {
            if(args.uids){
                pomelo.app.get('channelService').pushMessageByUids(self.consts.Event.area.lottery,{
                    entityId: args.entityId,
                    lotteryResult: args.lotteryResult,
                },args.uids);
            }else {
                args.lottery.gameService.getChannel().pushMessage(self.consts.Event.area.lottery,{
                    entityId: args.entityId,
                    lotteryResult: args.lotteryResult,
                });
            }
        }
    });

	/**
	 * Publish notice
	 */
    betItem.on(this.consts.Event.area.notice, function(data){
        var lottery = self.getEntity(args.entityId);
        if (lottery) {
            lottery.gameService.getChannel().pushMessage(self.consts.Event.area.notice,{
                entityId: args.entityId,
                lotteryResult: args.lotteryResult,
            });
        }
	});
};

module.exports ={
	id:"betItemEvent",
	func:BetItemEvent,
	props:[
		{name:"consts", ref:"consts"}
	]
}
