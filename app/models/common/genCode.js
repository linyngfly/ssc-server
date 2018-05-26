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

module.exports.genCommitByModel = _genCommitByModel;