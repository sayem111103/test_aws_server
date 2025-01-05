import express from 'express'
import { courseController } from './course.controller'
import { validatation } from '../../middleware/validateRequest'
import { courseValidation } from './course.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.const'
const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.admin),
  validatation(courseValidation.createCourseValidationSchema),
  courseController.createCourse,
)

router.get('/best', courseController.getBestCourse)

router.get('/', courseController.getAllCourse)

router.put(
  '/:courseId',
  auth(USER_ROLE.admin),
  validatation(courseValidation.courseUpdateValidationSchema),
  courseController.updateCourse,
)

router.get('/:courseId/reviews', courseController.getCourseWithReview)

export const courseroute = router
