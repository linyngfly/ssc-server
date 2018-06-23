const GIT_HASH_VERSION=fcb59c922e937f7f0d06059bb427564f1bfc7c3c

//发布版本类型定义
const VERSION_TYPE = {
    BASE: 1,
    ALPHA: 2,
    BETA: 3,
    RC: 4,
    RELEASE: 5,
};

//房补版本类型标识
const VERSION_TYPE_TAG = {};
VERSION_TYPE_TAG[VERSION_TYPE.BASE]='base';
VERSION_TYPE_TAG[VERSION_TYPE.ALPHA]='alpha';
VERSION_TYPE_TAG[VERSION_TYPE.BETA]='beta';
VERSION_TYPE_TAG[VERSION_TYPE.RC]='rc';
VERSION_TYPE_TAG[VERSION_TYPE.RELEASE]='release';

//游戏类型定义
const GAME_TYPE = {
    LOCAL: 0, //本地
    WZGJ: 1, //王者国际
};

//游戏类型标志定义
const GAMETYPE_TAG = [
    'local',
    'wzgj',
];

const CDN_DOMAIN = {};
CDN_DOMAIN[GAME_TYPE.WZGJ] = "xxxcdn.xxxx.com";

module.exports = {
    //配置游戏发行版本
    LOCAL_DEV_MODE: true,  //是否为本地开发模式，发布时修改为false
    PUB_GAME_TYPE: GAME_TYPE.WZGJ,  //设置发布版本类型
    SSL: false, //是否启动SSL
    PUB_VERSION_TYPE:VERSION_TYPE.BETA, //发布版本类型
	
    PUB_VERSION_NO:'1.1.54', //发布版本号
	
	//发布版本时间
	PUB_VERSION_TIME:'2018-06-23_11:56:30',
	
	GIT_HASH_VERSION:GIT_HASH_VERSION,
    VERSION_TYPE:VERSION_TYPE,
    //游戏发行版本类型定义
    GAME_TYPE: GAME_TYPE,

    //版本标识
    GAMETYPE_TAG: GAMETYPE_TAG,

    CDN_DOMAIN: CDN_DOMAIN,

    IMG_DISPATCHER: [],

    CHEAT_BROKEN: [],

    WWW_DOMAIN: [],

    PLATFORM_DIVISION: [],

    REDIRECT_HTTPS: [],
};