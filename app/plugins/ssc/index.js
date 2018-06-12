const fs = require('fs');

const MODULES = {
    SUB_GAMES:{},
};

function readDirSync(_path){
    let pa = fs.readdirSync(_path);
    pa.forEach(function(file){
        let info = fs.statSync(_path+"/"+file);
        if(info.isDirectory()){
            try{
                MODULES.SUB_GAMES[file] = require(`./${file}`);
            }catch(err){
                err;
            }
        }
    });
}

readDirSync(__dirname);
MODULES.SUB_GAMES.hall = require('./hall');

module.exports = MODULES;