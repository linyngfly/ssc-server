const versions = require('../../config/versions');
const versionsUtil = require('../../config/versionsUtil');

module.exports = {
    DESIGN_CFG: require('../../config/design_cfg'),
    session: require('../../config/session'),
    versions: versions,
    versionsUtil: versionsUtil,
    dbCfg: require('../../config/db'),
    sysConfig: require('../../config/sysConfig'),
    payConfig: require(`../../config/service/${versions.GAMETYPE_TAG[versions.PUB_GAME_TYPE]}/payConfig`)
};