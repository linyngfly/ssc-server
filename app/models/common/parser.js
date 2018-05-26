const moment = require('moment');
const _ = require('lodash');

class Parser {
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
            case 'number': {
                if (!Number.isNaN(Number(value))) {
                    serialVal = value.toString();
                }
            }
                break;
            case 'string': {
                if (typeof value === 'string') {
                    serialVal = value;
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