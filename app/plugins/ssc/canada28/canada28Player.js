const SscPlayer = require('../sscPlayer');

class Canada28Player extends SscPlayer {
    constructor(opts) {
        super(opts);
    }

    canRemove(){
        if(!this.isBet() && !this.isOnline()){
            return true;
        }
    }

}

module.exports = Canada28Player;