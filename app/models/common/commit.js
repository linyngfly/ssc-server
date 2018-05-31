const parser = require('./parser');

class Commit {
    constructor() {
        this.__update = [];
    }

    get update() {
        return this.__update;
    }

    bIncr(key) {
        let typeInfo = this.getFieldDef(key);
        if (typeInfo) {
            return typeInfo.inc;
        }
        return false;
    }

    /**
     * 字段最小值修正
     * @param {key} key
     * @param {值} value
     */
    _minRevise(key, value) {
        let typeInfo = this.getFieldDef(key);
        if (typeInfo && typeInfo.type == 'number') {
            let _value = Number(value);
            if (Number.isNaN(_value)) {
                logger.error('玩家非法数值写入, 禁止写入');
                return null;
            }

            if (typeInfo.min != null) {
                let nowValue = this[`_${key}`];
                let newValue = nowValue + _value;
                if (newValue < typeInfo.min) {
                    return _value + Math.abs(newValue) + typeInfo.min;
                }
            }
            return _value;
        }
        return value;
    }

    _modify(key, value) {
        value = this._minRevise(key, value);
        if (null == value) {
            return;
        }
        if (this.bIncr(key)) {
            this[`_${key}`] += value;
        } else {
            this[`_${key}`] = value;
        }
        this.__update.push([key, value]);
    }

    _value(key) {
        return this[`_${key}`];
    }

    _sync(key, value){
        this[`_${key}`] = value;
    }

    getFieldDef(field){
    }

    getCmd(key) {
        let typeInfo = this.getFieldDef(key);
        let cmd = 'HSET';
        if (!typeInfo) {
            return null;
        }
        if (typeInfo.inc === true) {
            if (typeInfo.type == 'float') {
                cmd = 'HINCRBYFLOAT';
            } else {
                cmd = 'HINCRBY';
            }
        }
        return [cmd, typeInfo.inc === true];
    }

    /**
     * 添加属性到模型对象
     * @param key
     * @param data
     */
    appendValue(key, data) {
        let value = parser.parseValue(key, data, this);
        this[`_${key}`] = value;
    }

    /**
     * 模型对象转化为JSON对象
     * @return {{}}
     */
    toJSON() {
        let jsonData = {};
        for (let key in this) {
            if (typeof this[key] !== 'function' && key.indexOf('__') !== 0) {
                jsonData[key.replace(/^_/, '')] = this[key];
            }
        }
        return jsonData;
    }

    getKey(field){
    }

    getId(){
    }

    async commit() {
        let fields = this.__update;

        if (fields.length === 0) {
            return;
        }

        let cmds = [];
        let syncIndexs = {}, index = 0;
        for(let i=0;i<fields.length;i++){
            let key = fields[i];
            let tk = key[0];
            let [cmd,inc] = this.getCmd(tk);
            if (cmd) {
                let v = parser.serializeValue(tk, key[1], this);
                if (v != null) {
                    cmds.push([cmd, this.getKey(tk), this.getId(), v]);
                    if(inc){
                        syncIndexs[index] = tk;
                    }
                    ++index;
                }
            }
        }

        this.__update = [];

        if(cmds.length == 0){
            return;
        }

        let ret =  await redisConnector.multi(cmds);
        if(!ret){
            return;
        }

        for(let index in syncIndexs){
            this._sync(syncIndexs[index], ret[index]);
        }
        return ret;
    }
}

module.exports = Commit;