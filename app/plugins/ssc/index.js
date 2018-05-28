const fs = require('fs');

const MODULES = {};

function readDirSync(_path){
    let pa = fs.readdirSync(_path);
    pa.forEach(function(file){
        let info = fs.statSync(_path+"/"+file);
        if(info.isDirectory()){
            MODULES[file] = require(`./${file}`);
        }
    });
}

readDirSync(__dirname);
console.log(MODULES);
module.exports.SUB_GAMES = MODULES;