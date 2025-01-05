import express from 'express'
import { validatation } from '../../middleware/validateRequest'
import { reviewValidation } from './review.validation'
import { reviewController } from './review.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.const'
const router = express.Router()
router.post(
  '/',
  auth(USER_ROLE.user),
  validatation(reviewValidation.reviewValidationSchema),
  reviewController.createReview,
)

export const reviewroute = router
