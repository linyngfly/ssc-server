const router = require('koa-router')();
const path = require('path');
const { uploadFile } = require('../lib/upload')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
});

router.get('/upload', async(ctx,next)=>{
    let title = 'upload file async';
    await ctx.render('upload',{title});
});

router.post('/upload', async(ctx,next)=>{
    let result = { success: false }
    let serverFilePath = path.join( __dirname, '..' );
    let resourcePath = path.join(serverFilePath, 'public/uploads');

    // 上传文件事件
    result = await uploadFile( ctx, {
        fileType: 'album',
        path: resourcePath
    })
    ctx.body = result
});

module.exports = router
