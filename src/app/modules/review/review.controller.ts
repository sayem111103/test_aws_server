import { RequestHandler } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { TReview } from './review.interface'
import { reviewServices } from './review.service'
import httpStatus from 'http-status'

const createReview: RequestHandler = catchAsync(async (req, res) => {
  const data: TReview = req.body
  data.createdBy = req.user._id
  const result = await reviewServices.createReviewIntoDB(data)
  res.send({
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully',
    data: result,
  })
})

export const reviewController = {
  createReview,
}
