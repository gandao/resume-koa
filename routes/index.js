const router = require('koa-router')()

module.exports = (app) => {
  router.get('/resume/isLogin', require('./user').index)
  router.get('/resume/signout', require('./user').signout)
  router.post('/resume/signin', require('./user').signin)
  router.post('/resume/signup', require('./user').signup)

  router.post('/resume/editUser', require('./user').editUser)
  router.get('/resume/leverUp', require('./user').LeverUp)

  router.get('/resume/getResumes', require('./resume').getResumes)
  router.get('/resume/resumeDetail', require('./resume').resumeDetail)
  router.get('/resume/deleteResume', require('./resume').deleteResume)
  router.post('/resume/saveEdit', require('./resume').saveEdit)
  router.post('/resume/createResume', require('./resume').create)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
