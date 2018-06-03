const checkToken = require('./checkToken');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;
const answer = require('../../utils/answer');

class TokenFilter {
    constructor() {
        this._ignoreRoutes = new Set();
    }

    async before(msg, session, next) {
        let route = msg.__route__;
        if (this._ignoreRoutes.has(route)) {
            return next();
        }
        try {
            msg.uid = await checkToken(session.get('token') || msg.token);
        } catch (err) {
            return next(err, {Error:err});
        }
        next();
    }

    addIgnoreRoute(route) {
        this._ignoreRoutes.add(route);
    }

}

module.exports = new TokenFilter();