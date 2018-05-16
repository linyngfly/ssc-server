const RankMatchApp = require('./rankMatchApp');

module.exports.beforeStartup = async function(app, cb) {
    app.entry = new RankMatchApp();
    await app.entry.start();
    cb();
};


module.exports.afterStartup = function(app, cb) {
    cb();
};


module.exports.beforeShutdown = function(app, cb) {
    app.entry.stop();
    cb();
};

module.exports.afterStartAll = function(app) {
};
