const constants = require('./constants');
const ACCOUNT_PREFIX = `${constants.PREFIX}account:`;
const BET_PREFIX = `${constants.PREFIX}bet:`;

module.exports = {
    ACCOUNT_PREFIX:ACCOUNT_PREFIX,
    getAccountKey: function (field) {
        return `${ACCOUNT_PREFIX}${field}`;
    },
    getBetKey: function (field) {
        return `${BET_PREFIX}${field}`;
    }
};