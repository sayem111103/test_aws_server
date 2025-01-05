import { RequestHandler } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { userServices } from './user.service'
import httpStatus from 'http-status'

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const userData = req.body
  const result = await userServices.createUserIntoDB(userData)
  res.send({
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: result,
  })
})

export const userController = {
  createUser,
}
