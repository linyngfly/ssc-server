const fs = require('fs');

const PLUGINS = {};

/**
 * 加载游戏插件
 * @param _path
 */
function loadPlugins(_path){
    let pa = fs.readdirSync(_path);
    pa.forEach(function(file){
        let info = fs.statSync(_path+"/"+file);
        if(info.isDirectory()){
            // console.log('file=',_path+"/"+file)
            PLUGINS[file] = require(`./${file}`);
        }
    });
}
loadPlugins(__dirname);
module.exports = PLUGINS;

