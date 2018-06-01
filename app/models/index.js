const fs = require('fs');
const path = require('path');
const versionsUtil = require('../../config/versionsUtil');
const VER = versionsUtil.getVerKey();
const root = path.join(__dirname, VER);
const MODELS = {};

function readDirSync(_path){
    let pa = fs.readdirSync(_path);
    pa.forEach(function(file){
        let info = fs.statSync(_path+"/"+file);
        if(info.isDirectory() && file == VER){
            console.log('file=',_path+"/"+file)
            readDirSync(_path+"/"+file);
        }else{
            console.log('file=',file)
            if (/.*?\.js$/.test(file) || /.*?\.json$/.test(file)) {
                let name = path.parse(file).name;
                MODELS[name] = require(`./${VER}/${file}`);
            }else {
                MODELS[file] = require(`./${VER}/${file}`);
            }
        }
    });
}

readDirSync(root);

module.exports = MODELS;
// console.log(MODELS);

// MODELS.account.playerHelper.createAccount(1, {username:'linyng', phone:'18183276216'});
