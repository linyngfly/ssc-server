const PLAYER_PREFIX = 'player:uid:';

module.exports = {
    PLAYER_PREFIX:PLAYER_PREFIX,
    getPlayerKey: function (field) {
        return `${PLAYER_PREFIX}${field}`;
    }
};