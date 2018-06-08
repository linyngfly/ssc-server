const SscPlayer = require('../sscPlayer');
class Lucky28Player extends SscPlayer {
    constructor(opts) {
        super(opts);
    }

    canRemove(){
        if(!this.isBet() && !this.isOnline()){
            return true;
        }
    }

}

module.exports = Lucky28Player;