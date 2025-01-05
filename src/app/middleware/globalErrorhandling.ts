/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express'
import httpStatus from 'http-status'
import { ZodError } from 'zod'
import { handleValidationError } from '../error/handleValidationError'
import AppError from '../error/AppError'

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = 500
  let message = 'Something Went Wrong!'
  let errorMessage = err?.message
  let errorDetails = err
  let stack = err?.stack
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST
    // eslint-disable-next-line no-unused-expressions
    ;(message = 'Zod Error'),
      (errorMessage = `${err?.issues?.map((errData) => errData.message)}`)
    errorMessage = errorMessage.split(',').join('. ')
  }

  if (err?.name === 'ValidationError') {
    const error = handleValidationError(err)
    errorMessage = `${error?.map((errData) => errData.path)} ${
      error?.length > 1 ? 'are' : 'is'
    } Required`
    statusCode = httpStatus.BAD_REQUEST
    message = `${error?.map((errData) =>
      errData?.name ? `${errData?.name}` : 'Error',
    )}`
  } 

  if (err?.code === 11000) {
    const match = err?.message?.match(/"([^"]*)"/)
    const extracted = match && match[1]
    statusCode = httpStatus.BAD_REQUEST
    errorMessage = `${extracted} is already exists!`
    message = 'Duplicate Entry'
  }

  if (err?.name === 'CastError') {
    statusCode = httpStatus.BAD_REQUEST
    message = 'Invalid ID'
    errorMessage = `${err?.value} is not a valid ID!`
  }

  if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = 'App Error'
    errorMessage = err?.message
    if (err.statusCode === httpStatus.UNAUTHORIZED) {
      statusCode = err?.statusCode
      message = 'Unauthorized Access'
      errorMessage = err?.message
      errorDetails = null
      stack = null
    }
  }

  return res.status(statusCode as number).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack,
  })
}
