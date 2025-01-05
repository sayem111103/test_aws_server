import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../utils/catchAsync'
import { TUserRole } from './../modules/user/user.interface'
import AppError from '../error/AppError'
import httpStatus from 'http-status'
import { config } from '../config/config'
import { User } from '../modules/user/user.model'
const auth = (...userRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You do not have the necessary permissions to access this resource.',
      )
    }

    const decoded = jwt.verify(token, config.secret as string) as JwtPayload
    const { _id, email, role } = decoded
    const user = await User.findById(_id)
    if (!user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You do not have the necessary permissions to access this resource.',
      )
    }
    if (email !== user?.email) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You do not have the necessary permissions to access this resource.',
      )
    }
    if (userRole && !userRole.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You do not have the necessary permissions to access this resource.',
      )
    }
    req.user = decoded as JwtPayload
    next()
  })
}

export default auth
