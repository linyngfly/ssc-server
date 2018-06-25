const versions = require('../versions');
const VER = versions.LOCAL_DEV_MODE ? versions.GAMETYPE_TAG[versions.GAME_TYPE.LOCAL] : versions.GAMETYPE_TAG[versions.PUB_GAME_TYPE];

module.exports = {
    redis: require(`./${VER}/redis.json`),
    mysql: require(`./${VER}/mysql.json`),
};