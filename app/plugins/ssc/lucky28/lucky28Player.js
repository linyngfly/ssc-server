const SscPlayer = require('../sscPlayer');

class Lucky28Player extends SscPlayer {
    constructor(opts) {
        super(opts);
    }

    //获取投注的赔率
    _getBetRate(typeCode) {
        return 1;
    }

}

module.exports = Lucky28Player;