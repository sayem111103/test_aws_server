import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import { PasswordHistory, User } from '../user/user.model'
import { TLoginUser, TPassChange } from './auth.interface'
import { createAccessToken } from './auth.utils'
import { config } from '../../config/config'
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose, { Types } from 'mongoose'
import { TPassHistory } from '../user/user.interface'

const Login = async (payload: TLoginUser) => {
  const user = await User.isUserExist(payload?.username)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  )
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')
  }
  const find = await User.findOne({ email: user?.email }).select(
    '-password -createdAt -updatedAt -__v',
  )
  const jwtPayload: {
    _id: Types.ObjectId | undefined // Assuming you want to use string for _id in the JWT payload
    role: string | undefined
    email: string | undefined
  } = {
    _id: find?._id,
    role: find?.role,
    email: find?.email,
  }
  const accessToken = createAccessToken(
    jwtPayload,
    config.secret as string,
    config.expirein as string,
  )

  const result = {
    user: find,
    token: accessToken,
  }
  return result
}

const changePassword = async (payload: TPassChange, user: JwtPayload) => {
  const isUserExist = await User.findById(user?._id).select('+password')
  const { currentPassword, newPassword } = payload
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  }
  const isPasswordMatched = await User.isPasswordMatched(
    currentPassword,
    isUserExist?.password,
  )
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')
  }
  if (currentPassword === newPassword) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'you can not use your current password as your new password',
    )
  }
  const newHashedPass = await bcrypt.hash(
    newPassword,
    Number(config.saltRounds),
  )
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const addHistory: TPassHistory | null =
      await PasswordHistory.findOneAndUpdate(
        {
          userId: isUserExist?._id,
        },
        {
          $addToSet: {
            lastTwoPasswordHistory: [currentPassword],
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
    if (!addHistory) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to change password')
    }
    if (addHistory && addHistory?.lastTwoPasswordHistory?.length > 3) {
      addHistory?.lastTwoPasswordHistory?.shift()
      const updatedHistory = await PasswordHistory.findOneAndUpdate(
        {
          userId: isUserExist?._id,
        },
        {
          lastTwoPasswordHistory: addHistory?.lastTwoPasswordHistory,
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
      if (
        updatedHistory &&
        updatedHistory?.lastTwoPasswordHistory.length <= 3 &&
        updatedHistory?.lastTwoPasswordHistory.includes(newPassword)
      ) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          'you can not use among last 2 password as your new password',
        )
      }
    }
    if (
      addHistory &&
      addHistory.lastTwoPasswordHistory.length <= 3 &&
      addHistory?.lastTwoPasswordHistory.includes(newPassword)
    ) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        'you can not use among last 2 password as your new password',
      )
    }
    const result = await User.findByIdAndUpdate(
      isUserExist?._id,
      {
        $set: {
          password: newHashedPass,
          passwordChangedAt: new Date(),
        },
      },
      { new: true, runValidators: true, upsert: true, session },
    )
    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to change password')
    }
    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, `${err}`)
  }
}

export const authservices = {
  Login,
  changePassword,
}
