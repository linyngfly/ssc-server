const SscPlayer = require('../sscPlayer');

class CQPlayer extends SscPlayer {
    constructor(opts) {
        super(opts);
    }

    //获取投注的赔率
    _getBetRate(typeCode) {
        return 1;
    }

}

module.exports = CQPlayer;