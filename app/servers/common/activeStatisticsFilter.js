const statistics = require('./statistics');

class ActiveStatisticsFilter {

    async before(ctx, next) {
        if (ctx.request.body && ctx.request.body.uid) {
            statistics.playerActive(ctx.request.body.uid);
            statistics.playerApiOperateLog(ctx.request.body.uid, ctx.url);
        }
        await next();
    }

    async after(ctx, next) {

        await next();
    }

}

module.exports = new ActiveStatisticsFilter();