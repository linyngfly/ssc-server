const fs = require('fs');

const MODELS = {};

function readDirSync(_path){
    let pa = fs.readdirSync(_path);
    pa.forEach(function(file){
        let info = fs.statSync(_path+"/"+file);
        if(info.isDirectory()){
            MODELS[file] = require(`./${file}`);
        }
    });
}

readDirSync(__dirname);

module.exports = MODELS;