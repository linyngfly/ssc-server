const models = require('../../models');
const ERROR_OBJ = require('../../consts/error_code').ERROR_OBJ;

module.exports = async function (uid, token) {
    let account = await models.player.getPlayer(uid, [models.player.fieldConst.TOKEN, models.player.fieldConst.TEST]);
    if (account.token == "daily_reset") {
        throw ERROR_OBJ.DAILY_RESET;
    } else if (account.test < 0 || account.token.search('cheat') >= 0) {
        throw ERROR_OBJ.PLAYER_CHEAT;
    } else if (account.token != token) {
        throw ERROR_OBJ.TOKEN_INVALID;
    }
};