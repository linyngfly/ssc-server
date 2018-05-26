const dataModels = require('../../models/wzgj/dataModel.wzgj');

let dataCache = {};
for(let tab_name in dataModels){
    let tab_cols = dataModels[tab_name];
    for(let item in tab_cols){
        dataCache[`${tab_name}:${item}}`] = tab_cols[item];
    }
}

let _getFieldDef = function (field) {
    return dataCache[field];
};

module.exports.getFieldDef = _getFieldDef;