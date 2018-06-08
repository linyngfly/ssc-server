const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;
const answer = require('../../utils/answer');
const checkToken = require('./checkToken');

class HttpTokenFilter {
    constructor() {
        this._ignoreRouteMap = new Set();
    }

    async before(ctx, next) {
        try {
            for (let route of this._ignoreRouteMap) {
                if (ctx.url.search(route) >= 0) {
                    return await next();
                }
            }

            if (ctx.request.body && ctx.request.body.token) {
                ctx.request.body.uid = await checkToken(ctx.request.body.token);
            }else {
                throw ERROR_OBJ.PARAM_MISSING;
            }
            await next();
        } catch (err) {
            logger.info(ctx.url, '会话TOKEN无效，请重新登录', err);
            ctx.body = answer.httpResponse(err, ctx.request.body.aes, true);
        }
    }

    async after(ctx, next) {
        await next();
    }

    addIgnoreRoute(route) {
        this._ignoreRouteMap.add(route);
    }
}

module.exports = new HttpTokenFilter();