import { RequestHandler } from 'express'
import { TCourse } from './course.interface'
import { courseServices } from './course.service'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'

const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const data: TCourse = req.body
  const startDate = new Date(data?.startDate)
  const endDate = new Date(data?.endDate)
  const time = endDate.getTime() - startDate.getTime()
  const days = time / (1000 * 3600 * 24)
  const durationInWeeks = Math.ceil(days / 7)
  data.durationInWeeks = durationInWeeks
  data.createdBy = req.user._id
  const result = await courseServices.createCourseIntoDB(data)
  res.send({
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course created successfully',
    data: result,
  })
})

const getAllCourse: RequestHandler = catchAsync(async (req, res) => {
  const { meta, result } = await courseServices.getAllCourseFromDB(req.query)
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses retrieved successfully',
    meta: meta,
    data: result,
  })
})

const updateCourse: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body
  const id = req.params.courseId
  const result = await courseServices.updateCourseIntoDB(id, data)
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course updated successfully',
    data: result,
  })
})

const getCourseWithReview = catchAsync(async (req, res) => {
  const id = req.params.courseId
  const result = await courseServices.getCourseWithReviewFromDB(id)
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course and Reviews retrieved successfully',
    data: result,
  })
})

const getBestCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getBestCourseFromDB()
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Best course retrieved successfully',
    data: result,
  })
})
export const courseController = {
  createCourse,
  getAllCourse,
  updateCourse,
  getCourseWithReview,
  getBestCourse,
}
