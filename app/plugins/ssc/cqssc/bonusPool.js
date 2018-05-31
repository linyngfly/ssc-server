class BonusPool {
    start() {

    }

    stop() {

    }

    /**
     * 投注通道是否关闭
     * 提前30s封注
     * @return {boolean}
     */
    canBetNow() {
        return true;
    }

    getNextPeriod() {
        return '2018032323';
    }

    getIdentify() {
        return ';';
    }
}

module.exports = BonusPool;