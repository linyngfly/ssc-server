const SscPlayer = require('../sscPlayer');

class Canada28Player extends SscPlayer {
    constructor(opts) {
        super(opts);
    }

    //获取投注的赔率
    _getBetRate(type) {
        return 1;
    }

}

module.exports = Canada28Player;