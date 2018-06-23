require('./app/utils/logHelper');
const omelo = require('omelo');
const path = require('path');
const fs = require('fs');
const versions = require('./config/versions');
const omeloHttpPlugin = require('omelo-http-plugin');
const logger = require('omelo-logger').getLogger('default', __filename);
const sysConfig = require('./config/sysConfig');
const globalChannel = require('omelo-globalchannel-plugin');
const status = require('omelo-status-plugin');
const sscCmd = require('./app/cmd/sscCmd');
let SSL = null;
if (sysConfig.SSL_CERT) {
    SSL = {
        type: 'wss',
        key: fs.readFileSync(sysConfig.SSL_CERT.KEY, 'utf8'),
        cert: fs.readFileSync(sysConfig.SSL_CERT.CERT, 'utf8'),
        strictSSL: false,
        rejectUnauthorized: false
    };
}

/**
 * Init app for client.
 */

const VER = versions.LOCAL_DEV_MODE ? versions.GAMETYPE_TAG[versions.GAME_TYPE.LOCAL] : versions.GAMETYPE_TAG[versions.PUB_GAME_TYPE];
let app = omelo.createApp({
    version_key: VER
});

app.set('name', 'ssc-server');
app.set('errorHandler', function (err, msg, resp, session, next) {
    logger.error('-------errorHandler happend ---->', err);
    next(err, resp);
});

app.set('rpcErrorHandler', function (err, serverId, msg, opts) {
    logger.error('-------rpcErrorHandler happend ---->', err);
});

app.set('globalErrorHandler', function (err, msg, resp, session, opts, next) {
    logger.error('-------globalErrorHandler happend ---->', err);
    next();
});

app.loadConfig('versions', require('./config/versions'));
app.loadConfig('redis', require('./app/utils/imports').dbCfg.redis);
app.loadConfig('mysql', require('./app/utils/imports').dbCfg.mysql);
app.loadConfig('http', path.join(app.getBase(), `config/service/${VER}/http`));
app.loadConfig('adminUser', require('./config/adminUser'));

const httpAesFilter = require('./app/servers/common/httpAesFilter');
const httpTokenFilter = require('./app/servers/common/httpTokenFilter');
const Http304Filter = require('./app/servers/common/http304Filter');
const httpLockFilter = require('./app/servers/common/httpLockFilter');
const activeStatisticsFilter = require('./app/servers/common/activeStatisticsFilter');
const httpSwitchFilter = require('./app/servers/common/httpSwitchFilter');
const serviceSwitchFilter = require('./app/servers/common/serviceSwitchFilter');
const tokenFilter = require('./app/servers/common/tokenFilter');

// configure for global
app.configure('production|development', function () {
    // load configure

    // app.enable('systemMonitor');
    // filter configures
    // app.before(omelo.filters.toobusy()); // 服务器繁忙
    // app.filter(omelo.filters.serial()); //主要负责保证所有从客户端到服务端的请求能够按顺序地处理
    // app.filter(omelo.filters.time()); //主要负责记录请求的相应时间
    //app.filter(omelo.filters.timeout()); //主要负责监控请求响应时间，如果超时就给出警告
    //app.before(decryptFilter);
    //app.filter(queueFilter);

    if (typeof app.registerAdmin === 'function') {
        let modules = require('./app/modules');
        for (let moduleId in modules) {
            app.registerAdmin(modules[moduleId], {
                app: app
            });
        }
    }

    // proxy configures
    app.set('proxyConfig', {
        cacheMsg: true,
        interval: 30,
        lazyConnection: true
        // enableRpcLog: true
    });

    // remote configures
    app.set('remoteConfig', {
        cacheMsg: true,
        interval: 30
    });

    const redisCfg = app.get('redis');
    app.use(globalChannel, {
        globalChannel: {
            // prefix: 'globalChannel',
            host: redisCfg.server.host,
            port: redisCfg.server.port,
            db: '2',
            auth_pass: redisCfg.server.password,
            cleanOnStartUp: true
        }
    });

    app.use(status, {
        status: {
            // prefix: 'status',
            host: redisCfg.server.host,
            port: redisCfg.server.port,
            db: '2',
            auth_pass: redisCfg.server.password,
            cleanOnStartUp: true
        }
    });

    // route configures
    const rpcRoute = require('./app/net/rpcRoute');
    app.route('game', rpcRoute.gameRoute);
    app.route('rankMatch', rpcRoute.rankMatchRoute);
});

// 服务基础配置
app.configure('production|development', 'gate|game|resource', function () {
    global.logger = require('omelo-logger').getLogger(app.getServerId());
});

//服务http配置
app.configure('production|development', 'gate|game|resource', function () {
    app.use(omeloHttpPlugin, {
        http: app.get('http')
    });
});

// 网关配置
app.configure('production|development', 'gate', function () {
    // httpTokenFilter.addIgnoreRoute('/auth');
    // httpTokenFilter.addIgnoreRoute('/login');
    // httpTokenFilter.addIgnoreRoute('/register');
    // httpTokenFilter.addIgnoreRoute('/modifyPassword');
    // httpTokenFilter.addIgnoreRoute('/index.html');
    // omeloHttpPlugin.filter(httpTokenFilter);
    app.before(serviceSwitchFilter);
});

// 游戏服务配置
app.configure('production|development', 'game', function () {
    let connectorConfig = {
        connector: omelo.connectors.hybridconnector,
        heartbeat: 10,
        useDict: true,
        useProtobuf: true
    };
    SSL && (connectorConfig.ssl = SSL);
    app.set('connectorConfig', connectorConfig);

    httpTokenFilter.addIgnoreRoute('setOrderState');
    httpTokenFilter.addIgnoreRoute('setBroadcast');
    httpTokenFilter.addIgnoreRoute('setInitMoney');
    httpTokenFilter.addIgnoreRoute('setPlayerInfoByGM');
    httpTokenFilter.addIgnoreRoute('publishSysMessage');
    omeloHttpPlugin.filter(httpTokenFilter);

    app.before(tokenFilter);
    const sscPlayerFilter = require('./app/servers/game/filter/sscPlayerFilter');
    sscPlayerFilter.addRoute(sscCmd.request.enter.route);
    app.before(sscPlayerFilter);
});


// start app
app.start();

process.on('uncaughtException', function (err) {
    logger.error(' Caught exception: ' + err.stack);
});

process.on('unhandledRejection', (reason, p) => {
    logger.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});