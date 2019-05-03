const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ResumeSchema = new Schema({
  _uid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      dafault: Date.now()
    }
  }
})

// 设置保存时的钩子
ResumeSchema.pre('save', function (next) {
  this.meta.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Resume', ResumeSchema)
