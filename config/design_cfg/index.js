const versionsUtil = require('../versionsUtil');
const VER = versionsUtil.getVerKey();
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, VER);
const DESIGN_CFG = {};

function readDirSync(_path){  
    let pa = fs.readdirSync(_path);  
    pa.forEach(function(file){
        var info = fs.statSync(_path+"/"+file);      
        if(info.isDirectory()){  
            readDirSync(_path+"/"+file);  
        }else{  
            if (/.*?\.js$/.test(file) || /.*?\.json$/.test(file)) {
                let name = path.parse(file).name;
                DESIGN_CFG[name] = require(`./${VER}/${file}`);
            }
        }     
    });  
} 

readDirSync(root);

//require('./vietnam') //TODO 开发测试
module.exports = DESIGN_CFG;