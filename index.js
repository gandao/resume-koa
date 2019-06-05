const Koa = require('koa')
const serve = require('koa-static')
const session = require('koa-session')
const mongoose = require('mongoose')
const path = require('path')
const router = require('./routes')
// const bodyParser = require('koa-bodyparser')
const CONFIG = require('./config')
const logger = require('koa-logger')
const koaBody = require('koa-body')

const app = module.exports = new Koa()

// 连接mongodb服务
mongoose.Promise = global.Promise
mongoose.connect(CONFIG.mongodb, { useNewUrlParser: true, useCreateIndex: true }, function (err) {
  if (err) {
    console.log('Connection Error:' + err)
  } else {
    console.log('Connection success!')
  }
})

// 配置session
app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge,
  httpOnly: CONFIG.session.httpOnly
}, app))

app.keys = [CONFIG.session.key]

// 配置解析Post数据的解析中间件
// app.use(bodyParser())

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))

// 配置静态资源
app.use(serve(
  path.join(__dirname, 'dist')
))
app.use(serve(
  path.join(__dirname, 'public')
))

// 配置log信息
app.use(logger())

// 配置路由
router(app)

if (!module.parent) app.listen(CONFIG.port)
console.log(`server is running at http://localhost:${CONFIG.port}`)
