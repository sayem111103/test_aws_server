import express from 'express'
import { validatation } from '../../middleware/validateRequest'
import { userValidation } from './user.validation'
import { userController } from './user.controller'
const router = express.Router()

router.post(
  '/register',
  validatation(userValidation.userValiidationSchema),
  userController.createUser,
)

export const userRoute = router
