const fs = require('fs');

const MODULES = {
    SUB_GAMES:{},
    HALL:{},
};

function readDirSync(_path){
    let pa = fs.readdirSync(_path);
    pa.forEach(function(file){
        let info = fs.statSync(_path+"/"+file);
        if(info.isDirectory()){
            MODULES.SUB_GAMES[file] = require(`./${file}`);
        }
    });
}

readDirSync(__dirname);
MODULES.SUB_GAMES.HALL = require('./hall');

module.exports = MODULES;