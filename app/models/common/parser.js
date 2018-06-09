const moment = require('moment');
const _ = require('lodash');

class Parser {

    changeFloatDecimal(x, precision) {
        let base = Math.pow(10, precision);
        let f_x = Math.floor(x * base) / base;
        let s_x = f_x.toString();
        let pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + precision) {
            s_x += '0';
        }
        return Number(s_x);
    }
    /**
     * 序列化对象为redis value
     * @param key
     * @param value
     * @returns {*}
     */
    serializeValue(key, value, obj, isDefault = true) {
        let serialVal = null;
        let typeInfo = obj.getFieldDef(key);
        if (!typeInfo) {
            logger.error(`${key}字段Model中未定义,无法写入redis, 请检查字段名是否正确`);
            throw new Error(`${key}字段Model中未定义,无法写入redis, 请检查字段名是否正确`);
        }

        if ((null === value || undefined === value || '' === value) && isDefault) {
            if (typeInfo.type === 'object') {
                value = _.cloneDeep(typeInfo.def);
            } else {
                value = typeInfo.def;
            }
        }

        switch (typeInfo.type) {
            case 'float':
                if(typeInfo.precision){
                    value = this.changeFloatDecimal(value, typeInfo.precision);
                }
            case 'number': {
                if (!Number.isNaN(Number(value))) {
                    serialVal = value.toString();
                }
            }
                break;
            case 'string': {
                if (typeof value === 'string') {
                    serialVal = value;
                }else {
                    serialVal = value.toString();
                }
            }
                break;
            case 'timestamp': {
                if (typeof value === 'string' && Number.isNaN(Number(value))) {
                    serialVal = moment(value).format('YYYY-MM-DD HH:mm:ss');
                } else if (!Number.isNaN(Number(value))) {
                    serialVal = moment(Number(value)).format('YYYY-MM-DD HH:mm:ss');
                }
            }
                break;
            case 'object': {
                if (typeof value === 'object') {
                    serialVal = JSON.stringify(value);
                }
            }
                break;
            default:
                break;
        }

        if (null == serialVal) {
            logger.error(`${key}字段值NULL非法,无法写入redis,请检查数据来源是否正确`);
            throw new Error(`${key}字段值NULL非法,无法写入redis,请检查数据来源是否正确`);
        }
        return serialVal;
    }

    /**
     * 解析redis数据
     * @param key
     * @param val
     * @returns {null}
     */
    parseValue(key, value, obj, isDefault = true) {
        let typeInfo = obj.getFieldDef(key);
        if (!typeInfo) {
            logger.error(`${key}字段Model中未定义,无法解析`);
            throw new Error(`${key}字段Model中未定义,无法解析`);
        }

        if ((null == value || 'undefined' == value || '' === value || 'null' === value) && isDefault) {
            if (typeInfo.type === 'object') {
                value = _.cloneDeep(typeInfo.def);
            } else {
                value = typeInfo.def;
            }
        }

        let serialVal = null;
        switch (typeInfo.type) {
            case 'float':
                if(typeInfo.precision){
                    value = this.changeFloatDecimal(value, typeInfo.precision);
                }
            case 'number': {
                if (!isNaN(Number(value))) {
                    serialVal = Number(value);
                }
            }
                break;
            case 'string':
                serialVal = value;
                break;
            case 'timestamp':
                if (typeof (value) === 'string' && value.indexOf('-') === -1) {
                    value = Number(value);
                }
                serialVal = moment(value).format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'object': {
                try {
                    serialVal = JSON.parse(value);
                } catch (err) {
                    logger.error(`${key}字段值${value}异常,无法读取,请检查数据来源是否正确`);
                }
            }
                break;
            default:
                break;
        }

        if (serialVal == null) {
            logger.error(`${key}字段值异常,无法读取,请检查数据来源是否正确`);
            throw new Error(`${key}字段值异常,无法读取,请检查数据来源是否正确`);
        }
        return serialVal;
    }
}


module.exports = new Parser();