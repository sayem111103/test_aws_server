import express from 'express'
import { categoryValidation } from './category.validation'
import { categoryController } from './category.controller'
import { validatation } from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.const'
const router = express.Router()
router.post(
  '/',
  auth(USER_ROLE.admin),
  validatation(categoryValidation.categoryValidationSchema),
  categoryController.createCategory,
)
router.get('/', categoryController.getAllCategory)
export const categoryroute = router
