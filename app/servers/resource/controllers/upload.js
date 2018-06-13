const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
const uuidV4 = require('uuid/v4');

class Upload {
    constructor() {
        this._storePath = path.join(global.STATIC_DIR, 'uploads/audio');
    }

    pushAudioFile(data, ctx) {
        let req = ctx.req;
        let busboy = new Busboy({headers: req.headers});
        let self = this;

        let result = {
            success: false,
            message: '',
            data: null
        };

        return new Promise(function (resolve, reject) {
            // 解析请求文件事件
            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

                let fileName = uuidV4().replace(new RegExp(/(-)/g), '') + '.' + self._getSuffixName(filename);
                let _uploadFilePath = path.join(this._storePath, fileName);
                let saveTo = path.join(_uploadFilePath);

                // 文件保存到制定路径
                file.pipe(fs.createWriteStream(saveTo));

                // 文件写入事件结束
                file.on('end', function () {
                    result.success = true;
                    result.message = '文件上传成功';
                    result.data = {
                        pictureUrl: `//${ctx.host}/uploads/${fileName}`
                    };
                    logger.error('文件上传成功！');
                    resolve(result);
                });
            });

            // 解析结束事件
            busboy.on('finish', function () {
                logger.info('文件上结束');
                resolve(result);
            });

            // 解析错误事件
            busboy.on('error', function (err) {
                logger.error('文件上出错');
                reject(result);
            });

            req.pipe(busboy);
        });
    }

    _getSuffixName(fileName) {
        let nameList = fileName.split('.');
        return nameList[nameList.length - 1];
    }
}

module.exports = new Upload();