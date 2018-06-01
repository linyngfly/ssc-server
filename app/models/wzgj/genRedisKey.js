const redisKeyConst = require('./redisKeyConst');
const ACCOUNT_PREFIX = `${redisKeyConst.PREFIX}account:`;
module.exports = {
    ACCOUNT_PREFIX:ACCOUNT_PREFIX,
    getPlayerKey: function (field) {
        return `${ACCOUNT_PREFIX}${field}`;
    }
};