import { USER_ROLE } from './user.const'
import { Model, Types } from 'mongoose'

export type TUser = {
  username: string
  email: string
  password: string
  role: 'user' | 'admin',
  passwordChangedAt?: Date
}

export type TPassHistory = {
  userId: Types.ObjectId
  lastTwoPasswordHistory: string[]
}

export type TUserRole = keyof typeof USER_ROLE
export interface userModel extends Model<TUser> {
  isUserExist(username: string): Promise<TUser>
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
}
