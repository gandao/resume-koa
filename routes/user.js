const UserModle = require('../models/user')
const bcrypt = require('bcryptjs')

const SUCCESS = 1
const FAIL = -1

module.exports = {
  // 判断是否已经登录
  async index (ctx, next) {
    if (ctx.session.user) {
      ctx.body = {
        id: SUCCESS,
        user: ctx.session.user,
        message: '用户已登录'
      }
    } else {
      ctx.body = {
        id: FAIL,
        user: '',
        message: '用户未登录'
      }
    }
    await next()
  },
  // 登录
  async signin (ctx, next) {
    const { email, password } = ctx.request.body
    const user = await UserModle.findOne({ email })

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        ctx.session.user = {
          _id: user._id,
          name: user.name,
          isAdmin: user.isAdmin,
          email: user.email,
          isVip: user.isVip
        }
        ctx.body = {
          id: SUCCESS,
          user: {
            name: user.name,
            isAdmin: user.isAdmin,
            isVip: user.isVip
          },
          message: '登录成功'
        }
      } else {
        ctx.body = {
          id: FAIL,
          user: '',
          message: '密码错误或者账号错误'
        }
      }
    } else {
      ctx.body = {
        id: FAIL,
        user: '',
        message: '用户不存在'
      }
    }
    await next()
  },
  // 注册
  async signup (ctx, next) {
    let { email, password, name } = ctx.request.body
    if (await UserModle.findOne({ email })) {
      ctx.body = {
        id: FAIL,
        message: '注册失败，邮箱已存在！'
      }
    } else {
      // 密码加密
      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)

      const user = {
        name,
        email,
        password,
        isAdmin: false,
        isVip: false
      }

      try {
        await UserModle.create(user)
        ctx.body = {
          id: SUCCESS,
          message: '注册成功'
        }
      } catch (err) {
        ctx.body = {
          id: FAIL,
          message: '注册失败',
          err: err.message
        }
      }
    }
    next()
  },
  // 登出
  async signout (ctx, next) {
    ctx.session.user = ''
    ctx.body = {
      id: SUCCESS,
      message: '注销成功'
    }
    next()
  },
  // 更改用户信息
  async editUser (ctx, next) {
    const { name, password } = ctx.request.body
    const { _id } = ctx.session.user
    let msg = {}
    if (name !== undefined && name !== null) {
      msg.name = name
    }
    if (password !== undefined && password !== null) {
      msg.password = password
    }

    await UserModle.findByIdAndUpdate(_id, msg)

    ctx.session.user.name = name

    ctx.body = {
      id: SUCCESS,
      message: '编辑成功'
    }

    next()
  },
  // 升级vip
  async LeverUp (ctx, next) {
    const { _id } = ctx.session.user

    await UserModle.findByIdAndUpdate(_id, {
      isVip: true
    })

    ctx.session.user.isVip = true
    ctx.body = {
      id: SUCCESS,
      message: '升级成功'
    }

    next()
  }
}
