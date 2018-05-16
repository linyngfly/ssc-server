const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const static = require('koa-static');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const cors = require('koa-cors');
const path = require('path');
const mysql = require('./lib/dao/mysql/mysql');
const daoUser = require('./lib/dao/daoUser');

const index = require('./routes/index');
const users = require('./routes/users');

// sudo apt-get install okular        pdf reader
// var mount_uploadify = require('koa-uploadify')
//
// mount_uploadify(app,{
//     path:'/upload',
//     fileKey:'myfile',
//     multer:{ dest: 'uploads/' },
//     callback:function(req){
//         console.log('-----------------',req.files);
//         return req.files
//     }
// });

//ssh root@116.31.99.217
//root
//C8d549B1y118O4t272

//59.110.237.46

// scp -rf root@116.31.99.217:/root/lottery/game-server/logs/node-log-undefined.log .

// error handler
onerror(app);

// middlewares
//跨域访问
app.use(cors());
app.use(logger());
app.use(bodyparser);
app.use(json());

app.use(static(path.join(__dirname, '/public')));

app.use(views(path.join(__dirname , '/views'), {
  extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

//Init mysql
mysql.init();

const uuidV4 = require('uuid/v4');

//Init sys user
function initSys() {
    const uuid = uuidV4().replace(new RegExp(/(-)/g), '');
    daoUser.createUser('sys', uuid, '', '', '', '', 0, 1, function (err, uid) {
        if (err) {
            console.error(err);
        } else {
            console.log('initSys user was created! --' + 'sys');
        }
    });
};

initSys();

module.exports = app;
