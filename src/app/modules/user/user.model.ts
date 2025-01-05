/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose'
import { TPassHistory, TUser, userModel } from './user.interface'
import bcrypt from 'bcrypt'
import { config } from '../../config/config'

const userSchema = new Schema<TUser, userModel>(
  {
    username: {
      type: String,
      required: [true, 'user name is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: 0,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
      },
      default: 'user',
    },
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true,
  },
)

const passwordHistorySchema = new Schema<TPassHistory>({
  userId: { type: Schema.Types.ObjectId, required: true },
  lastTwoPasswordHistory: { type: [String] },
})

// const user
userSchema.pre('save', async function (next) {
  const user = this
  user.password = await bcrypt.hash(user.password, Number(config.saltRounds))
  next()
})
userSchema.post('save', function (doc, next) {
  doc.set('password', undefined)
  next()
})
userSchema.statics.isUserExist = async function (username: string) {
  return await User.findOne({ username: username }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export const User = model<TUser, userModel>('User', userSchema)
export const PasswordHistory = model<TPassHistory>(
  'UserPassHistory',
  passwordHistorySchema,
)
