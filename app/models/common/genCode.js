const fs = require('fs');

function _genCommitByModel(model, filename, className) {
    let template = `const Commit = require('../../common/commit');\r\n`
    template += `class ${className} extends Commit {
    constructor() {
        super();
    }\r\n`;

    //自动添加方法
    let keys = Object.keys(model);
    keys.forEach(function (field) {
        template += `\tset ${field}(value) {
        this._modify('${field}', value);
    }
    get ${field}() {
        return this._value('${field}');
    }\r\n`
    });

    template += `}\r\n`
    template += `module.exports = ${className};`

    fs.writeFileSync(filename, template);
    console.log(template);
}

function _genTables(model, filename) {
    let template = `module.exports ={\r\n`;

    template += `MODEL_FIELDS:[`;
    let fields = Object.keys(model);
    for (let i = 0; i < fields.length; i++) {
        template += `'${fields[i]}',`;
    }
    template += `],\r\n`;

    let tables = new Set();
    for (let key in model) {
        let item = model[key];
        if (item.primary_key) {
            template += `PRI_KEY:'${key}',\r\n`;
            template += `PRI_TABLE:'${item.tbl}',\r\n`
        }
        tables.add(item.tbl);
    }
    template += `TABLES:[`;
    for (let tbl of tables) {
        template += `'${tbl}',`;
    }
    template += `],\r\n`;
    template += `};`;

    fs.writeFileSync(filename, template);
    console.log(template);
}

function _genFieldConst(model, filename) {
    let template = `module.exports ={\r\n`;
    let fields = Object.keys(model);
    for (let i = 0; i < fields.length; i++) {
        template += `   ${fields[i].toUpperCase()}:'${fields[i]}',\r\n`;
    }
    template += `};`;

    fs.writeFileSync(filename, template);
    console.log(template);
}

module.exports.genCommitByModel = _genCommitByModel;
module.exports.genTables = _genTables;
module.exports.genFieldConst = _genFieldConst;