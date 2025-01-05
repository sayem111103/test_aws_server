import express from 'express'
import { validatation } from '../../middleware/validateRequest'
import { authvalidation } from './auth.validation'
import { authController } from './auth.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.const'
const router = express.Router()
router.post(
  '/login',
  validatation(authvalidation.authvalidationschema),
  authController.userlogin,
)
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validatation(authvalidation.authPasswordChangevalidationschema),
  authController.userPasswordChange,
)
export const authroute = router
