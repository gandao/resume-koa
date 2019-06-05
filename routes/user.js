const UserModle = require('../models/user')
const bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer')
const SUCCESS = 1
const FAIL = -1

let transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: '1906357036@qq.com',
    pass: 'dxrvqhcokpkufaai'
  }
})

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
    // 获取参数
    const { email, password } = ctx.request.body
    const user = await UserModle.findOne({ email })
    if (user) { // 判断数据库中是否有该邮箱的账号
      if (await bcrypt.compare(password, user.password)) { // 判断密码是否一致
        // 后端利用session标记用户
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
  },
  // 获取验证码
  async getcode (ctx, next) {
    let email = ctx.request.query.email
    const user = await UserModle.findOne({ email })
    if (user) {
      // 生成四位验证码

      let code = Math.floor(Math.random() * 10000).toString()
      ctx.session.code = code

      let info = await transporter.sendMail({
        from: '1906357036@qq.com', // sender address
        to: email,
        subject: 'resume-build code',
        text: `验证码：${code}`,
        html: `<b>验证码：${code}</b>`
      })
      await transporter.sendMail(info)
      ctx.body = {
        id: SUCCESS,
        message: '验证码已发送'
      }
    } else {
      ctx.body = {
        id: FAIL,
        message: '该邮箱还未注册'
      }
    }
    next()
  },
  // 验证验证码
  async postcode (ctx, next) {
    let { code } = ctx.request.body
    if (ctx.session.code === code) {
      ctx.body = {
        id: SUCCESS,
        message: '验证码正确'
      }
    } else {
      ctx.body = {
        id: FAIL,
        message: '验证码错误'
      }
    }
    next()
  },
  // 修改用户密码
  async editPassword (ctx, next) {
    let { email, password } = ctx.request.body
    const user = await UserModle.findOne({ email })
    if (user) {
      // 生成四位验证码
      const salt = await bcrypt.genSalt(10)
      password = await bcrypt.hash(password, salt)
      if (await UserModle.findByIdAndUpdate(user._id, { password })) {
        ctx.body = {
          id: SUCCESS,
          message: '密码修改成功'
        }
      }
    } else {
      ctx.body = {
        id: FAIL,
        message: '修改密码失败'
      }
    }
    next()
  }
}
