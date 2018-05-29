const GAMEPLAY = {
    LOCAL: 0, //本地
    WZGJ: 1, //王者国际
};

const VER_KEY = [
    'local',
    'wzgj',
];

const CDN_DOMAIN = {};
CDN_DOMAIN[GAMEPLAY.WZGJ] = "vncdn1.secureswiftcontent.com";

module.exports = {
    //配置游戏发行版本
    DEVELOPMENT: false,  //发布时修改为false
    PUB: GAMEPLAY.WZGJ,  //设置发布版本类型
    SSL: false, //是否启动SSL

    //游戏发行版本类型定义
    GAMEPLAY: GAMEPLAY,
    //版本标识KEY
    VER_KEY:VER_KEY,

    CDN_DOMAIN:CDN_DOMAIN,

    IMG_DISPATCHER:[
    ],

    CHEAT_BROKEN: [
    ],

    WWW_DOMAIN: [
    ],

    PLATFORM_DIVISION: [
    ],

    REDIRECT_HTTPS: [
    ],
};