/**
 * Created by linyng on 17-6-15.
 */

var logger = require('pomelo-logger').getLogger('bearcat-lottery', 'betType');

function BetType() {
    this._init = false;
    this._typeMap = {};
    this._typeDuration = new Map();
};

BetType.prototype.initMap = function () {
    let initCode = 0;
    let begin = initCode+1;
    let dic = ['大','小','单','双','龙','虎'];
    for (let i=0; i< dic.length; i++){
        let key = `${dic[i]}`;
        let value = {
            code: ++initCode,
            desc:key
        }
        this._typeMap[key] =value;
    }

    dic = ['大','小','单','双'];
    for (let i= 1; i<=5;i++){
        for (let j=0; j< dic.length; j++){
            let key = `${i}球${dic[j]}`;
            let value = {
                code: ++initCode,
                desc:key
            }
            this._typeMap[key] =value;
        }
    }

    let end =  initCode;
    this._typeDuration.set('size', {begin:begin,end:end});

    begin = initCode+1;
    let heKey = {
        code:++initCode,
        desc:'合'
    };
    this._typeMap[`合`] = heKey;
    this._typeMap[`和`] = heKey;
    end =  initCode;
    this._typeDuration.set('sum', {begin:begin,end:end});


    dic = ['豹','顺'];
    let posDic = ['前', '中', '后'];
    let durationDic = ['bz','sz'];
    for (let i = 0; i< dic.length; i++){
        begin = initCode+1;
        for (let j = 0; j<posDic.length; j++){
            let key = `${posDic[j]}${dic[i]}`;
            let value = {
                code: ++initCode,
                desc:key
            }
            this._typeMap[key] =value;
        }
        end =  initCode;
        this._typeDuration.set(durationDic[i], {begin:begin,end:end});
    }


    begin = initCode+1;

    for(let i=1; i<= 5; i++){
        for (let j=0;j<=9;j++){
            let key = `${i}球${j}`;
            let value = {
                code: ++initCode,
                desc:key
            }
            this._typeMap[key] =value;
        }
    }
    end =  initCode;
    this._typeDuration.set('num', {begin:begin,end:end});

    this._init = true;
};

BetType.prototype.getSectionCode = function (key) {
    return this._typeDuration.get(key);
};

BetType.prototype.get = function (type, pos) {
    pos = pos || -1;
    if(!this._init){
        this.initMap();
    }

    if(pos === -1){
        let key = `${type}`;
        return this._typeMap[key];
    }
    else {
        let key = `${pos}球${type}`;
        return this._typeMap[key];
    }
};


module.exports = {
    id:'betType',
    func:BetType
};
