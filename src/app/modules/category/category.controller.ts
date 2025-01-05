import { RequestHandler } from 'express'
import { Tcategory } from './category.interface'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import { categoryServices } from './category.service'

const createCategory: RequestHandler = catchAsync(async (req, res) => {
  const data: Tcategory = req.body
  data.createdBy = req.user._id
  const result = await categoryServices.createCategoryIntoDB(data)
  res.send({
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  })
})

const getAllCategory: RequestHandler = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategoryFromDB()
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    data: result,
  })
})

export const categoryController = {
  createCategory,
  getAllCategory,
}
