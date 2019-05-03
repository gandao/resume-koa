const router = require('koa-router')()

// async function isLogin (ctx, next) {
//   if (!ctx.session.user) {
//     ctx.body = {
//       id: '-1',
//       message: '用户未登录'
//     }
//   } else {
//     await next()
//   }
// }

module.exports = (app) => {
  router.get('/resume/isLogin', require('./user').index)
  router.post('resume/signin', require('./user').signin)
  router.post('resume/signup', require('./user').signup)

  router.post('resume/editUser', require('./user').editUser)
  router.get('resume/leverUp', require('./user').LeverUp)

  router.get('resume/getResumes', require('./resume').getResumes)
  router.get('resume/resumeDetail', require('./resume').resumeDetail)
  router.get('resume/deleteResume', require('./resume').deleteResume)
  router.post('resume/saveEdit', require('./resume').saveEdit)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
