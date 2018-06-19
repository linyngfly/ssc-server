module.exports = {
    TYPE: {
        DATA: 0,
        EJS: 1,
        REDIRECT: 2,
        FILE: 3,
    },

    getExcelHeader:function(data){
        let ret = {
            encoding:'binary',
            headers:{}
        };
        ret.headers['Content-Type'] = 'application/vnd.openxmlformats';
        ret.headers['Content-Disposition'] = "attachment; filename=" + encodeURIComponent(data.fileName);

        return ret;
    },

    ask: function (data = {}, type = 0) {
        return {
            data: data,
            type: type
        };
    },

    askEjs: function (template, data) {
        return {
            data: {
                data:data,
                template: template,
            },
            type: 1
        };
    }
};