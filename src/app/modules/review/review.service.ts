import { TReview } from './review.interface'
import { Review } from './review.model'

const createReviewIntoDB = async (payload: TReview) => {
  const newReview = (await Review.create(payload)).populate('createdBy')
  return newReview
}

export const reviewServices = {
  createReviewIntoDB,
}
