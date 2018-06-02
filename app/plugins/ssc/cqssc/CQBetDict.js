class CQBetDict{
    constructor(){
        this._betTypeDictMap = new Map();
        this._betTypeIndexRange = new Map();
    }

    init(){
        let rangeIndex = 0;
        let begin = rangeIndex+1;
        let dic = ['大','小','单','双','龙','虎'];
        for (let i=0; i< dic.length; i++){
            let key = `${dic[i]}`;
            let value = {
                code: ++rangeIndex,
                desc:key
            };
            this._betTypeDictMap.set(key, value);
        }

        dic = ['大','小','单','双'];
        for (let i= 1; i<=5;i++){
            for (let j=0; j< dic.length; j++){
                let key = `${i}球${dic[j]}`;
                let value = {
                    code: ++rangeIndex,
                    desc:key
                };
                this._betTypeDictMap.set(key, value);
            }
        }

        let end =  rangeIndex;
        this._betTypeIndexRange.set('size', {begin:begin,end:end});

        begin = rangeIndex+1;
        let heKey = {
            code:++rangeIndex,
            desc:'合'
        };
        this._betTypeDictMap.set(`合`, heKey);
        this._betTypeDictMap.set(`和`, heKey);
        end =  rangeIndex;
        this._betTypeIndexRange.set('sum', {begin:begin,end:end});


        dic = ['豹','顺'];
        let posDic = ['前', '中', '后'];
        let durationDic = ['bz','sz'];
        for (let i = 0; i< dic.length; i++){
            begin = rangeIndex+1;
            for (let j = 0; j<posDic.length; j++){
                let key = `${posDic[j]}${dic[i]}`;
                let value = {
                    code: ++rangeIndex,
                    desc:key
                };
                this._betTypeDictMap.set(key, value);
            }
            end =  rangeIndex;
            this._betTypeIndexRange.set(durationDic[i], {begin:begin,end:end});
        }


        begin = rangeIndex+1;

        for(let i=1; i<= 5; i++){
            for (let j=0;j<=9;j++){
                let key = `${i}球${j}`;
                let value = {
                    code: ++rangeIndex,
                    desc:key
                }
                this._betTypeDictMap.set(key, value);
            }
        }
        end =  rangeIndex;
        this._betTypeIndexRange.set('num', {begin:begin,end:end});
    }

    getSectionCode(key){
        return this._betTypeIndexRange.get(key);
    }

    get(type, pos){
        pos = pos || -1;
        
        if(pos === -1){
            let key = `${type}`;
            return this._betTypeDictMap.get(key);
        }
        else {
            let key = `${pos}球${type}`;
            return this._betTypeDictMap.get(key);
        }
    }

}

module.exports = CQBetDict;