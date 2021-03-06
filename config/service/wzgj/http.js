const omelo = require('omelo');
const dbCfg = require('../../../app/utils/imports').dbCfg;
const versions = require('../../../app/utils/imports').versions;
const serversCfg = require('./servers.json')[omelo.app.env];
const sysConfig = require('../../sysConfig');
const SSL_CERT = sysConfig.SSL_CERT || {};

function getServerCfg(type, id) {
    let servers = serversCfg[type];
    let cfg = {};
    if (servers) {
        for (let i = 0; i < servers.length; i++) {
            if (servers[i].id == id) {
                cfg = servers[i];
                break;
            }
        }
    }
    return cfg;
}

module.exports = {
    development: {
        gate: [{
            id: 'gate',
            useCluster: false,
            useSSL: versions.SSL,
            static:{
                enable:true,
                opts:{
                    root:null,
                    index:false
                }
            },
            views: false,
            http: {
                host: getServerCfg('gate', 'gate').host,
                publicHost: getServerCfg('gate', 'gate').publicHost,
                port: 3002
            },
            https: {
                host: getServerCfg('gate', 'gate').host,
                publicHost: getServerCfg('gate', 'gate').publicHost,
                port: 443,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            },
        }],
        game: [{
            id: 'game-1-1',
            useCluster: false,
            useSSL: versions.SSL,
            static: {
                enable: false,
                opts: {
                    root: null,
                    index: false
                }
            },
            views: false,
            http: {
                host: getServerCfg('game', 'game-1-1').host,
                publicHost: getServerCfg('game', 'game-1-1').publicHost,
                port: 4002
            },
            https: {
                host: getServerCfg('game', 'game-1-1').host,
                publicHost: getServerCfg('game', 'game-1-1').publicHost,
                port: 4004,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }],
        chat: [{
            id: 'chat',
            useCluster: false,
            useSSL: versions.SSL,
            static: false,
            views: false,
            http: {
                host: getServerCfg('chat', 'chat').host,
                publicHost: getServerCfg('chat', 'chat').publicHost,
                port: 3702
            },
            https: {
                host: getServerCfg('chat', 'chat').host,
                publicHost: getServerCfg('chat', 'chat').publicHost,
                port: 3704,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }],
        resource: [{
            id: 'resource',
            useCluster: true,
            useSSL: versions.SSL,
            static: {
                enable: true,
                opts: {
                    root: null,
                    index: false
                }
            },
            views: true,
            http: {
                host: getServerCfg('resource', 'resource').host,
                publicHost: getServerCfg('resource', 'resource').publicHost,
                port: 3502
            },
            https: {
                host: getServerCfg('resource', 'resource').host,
                publicHost: getServerCfg('resource', 'resource').publicHost,
                port: 443,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }],
        loadManager: [{
            id: 'loadManager',
            useCluster: false,
            useSSL: versions.SSL,
            static: false,
            views: false,
            http: {
                host: getServerCfg('loadManager', 'loadManager').host,
                publicHost: getServerCfg('loadManager', 'loadManager').publicHost,
                port: 3202
            },
            https: {
                host: getServerCfg('loadManager', 'loadManager').host,
                publicHost: getServerCfg('loadManager', 'loadManager').publicHost,
                port: 3204,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }]
    },
    production: {
        gate: [{
            id: 'gate',
            useCluster: false,
            useSSL: versions.SSL,
            static: false,
            views: false,
            http: {
                host: getServerCfg('gate', 'gate').host,
                publicHost: getServerCfg('gate', 'gate').publicHost,
                port: 3002
            },
            https: {
                host: getServerCfg('gate', 'gate').host,
                publicHost: getServerCfg('gate', 'gate').publicHost,
                port: 443,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            },
        }],
        game: [{
            id: 'game-1-1',
            useCluster: false,
            useSSL: versions.SSL,
            static: {
                enable: false,
                opts: {
                    root: null,
                    index: false
                }
            },
            views: false,
            http: {
                host: getServerCfg('game', 'game-1-1').host,
                publicHost: getServerCfg('game', 'game-1-1').publicHost,
                port: 3602
            },
            https: {
                host: getServerCfg('game', 'game-1-1').host,
                publicHost: getServerCfg('game', 'game-1-1').publicHost,
                port: 3604,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }],
        chat: [{
            id: 'chat',
            useCluster: false,
            useSSL: versions.SSL,
            static: false,
            views: false,
            http: {
                host: getServerCfg('chat', 'chat').host,
                publicHost: getServerCfg('chat', 'chat').publicHost,
                port: 3702
            },
            https: {
                host: getServerCfg('chat', 'chat').host,
                publicHost: getServerCfg('chat', 'chat').publicHost,
                port: 3704,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }],
        resource: [{
            id: 'resource',
            useCluster: true,
            useSSL: versions.SSL,
            static: {
                enable: true,
                opts: {
                    root: null,
                    index: false
                }
            },
            views: true,
            http: {
                host: getServerCfg('resource', 'resource').host,
                publicHost: getServerCfg('resource', 'resource').publicHost,
                port: 3502
            },
            https: {
                host: getServerCfg('resource', 'resource').host,
                publicHost: getServerCfg('resource', 'resource').publicHost,
                port: 443,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }],
        loadManager: [{
            id: 'loadManager',
            useCluster: false,
            useSSL: versions.SSL,
            static: false,
            views: false,
            http: {
                host: getServerCfg('loadManager', 'loadManager').host,
                publicHost: getServerCfg('loadManager', 'loadManager').publicHost,
                port: 3202
            },
            https: {
                host: getServerCfg('loadManager', 'loadManager').host,
                publicHost: getServerCfg('loadManager', 'loadManager').publicHost,
                port: 3204,
                keyFile: SSL_CERT.KEY,
                certFile: SSL_CERT.CERT
            }
        }]
    }
};