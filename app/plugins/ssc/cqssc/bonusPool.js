class BonusPool{
    /**
     * 投注通道是否关闭
     * 提前30s封注
     * @return {boolean}
     */
    canBetNow(){
        return true;
    }
}

module.exports = BonusPool;