/**
 * 全局KEY常量定义
 * @type {{}}
 */

const PREFIX = 'wzgj:';

module.exports = {
    PREFIX: PREFIX,
    MAP_OPENID_UID: `${PREFIX}openid:uid`,
    SWITCH: {
        SERVICE: `${PREFIX}switch:service`, //服务开关
        API: `${PREFIX}switch:api`, //api开关
    },
    UID_COUNTER: `${PREFIX}counter:uid`,
    BETID_COUNTER: `${PREFIX}counter:betId`,
};
