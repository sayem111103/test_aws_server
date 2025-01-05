import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import { TLoginUser, TPassChange } from './auth.interface'
import { authservices } from './auth.service'
import { RequestHandler } from 'express'

const userlogin: RequestHandler = catchAsync(async (req, res) => {
  const credential: TLoginUser = req.body
  const result = await authservices.Login(credential)
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successfull',
    data: result,
  })
})

const userPasswordChange = catchAsync(async (req, res) => {
  const newCredential: TPassChange = req.body
  const result = await authservices.changePassword(newCredential, req?.user)
  res.send({
    success: true,
    statusCode: 200,
    message: 'Password changed successfully',
    data: result,
  })
})

export const authController = {
  userlogin,
  userPasswordChange,
}
