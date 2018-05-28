const path = require('path');
const omelo = require('omelo');

class ResourceApp {
    constructor() {
    }

    async start() {
        global.STATIC_DIR = path.join(omelo.app.getBase(), 'app/servers', omelo.app.getServerType(), 'public');
        logger.info('资源服启动成功', global.STATIC_DIR);
    }

    stop() {
        logger.info('资源服关闭');
    }

}

module.exports = ResourceApp;