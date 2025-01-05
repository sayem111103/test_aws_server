import mongoose from 'mongoose'
import { TCourse } from './course.interface'
import { Course } from './course.model'
import AppError from '../../error/AppError'
import httpStatus from 'http-status'
import { Review } from '../review/review.model'

const createCourseIntoDB = async (payload: TCourse) => {
  const newCourse = await Course.create(payload)
  return newCourse
}

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const excludeFields = [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
    'minPrice',
    'maxPrice',
    'tags',
    'level',
  ]
  const queryObj = { ...query }
  //Pagination
  let page = 1
  let limit = 10
  let skip = 0
  if (queryObj?.limit) {
    limit = Number(query?.limit)
  }
  if (queryObj?.page) {
    page = Number(queryObj?.page)
    skip = (page - 1) * limit
  }
  const pagination = Course.find().skip(skip).limit(limit)

  //Sorting
  let sort = {}
  if (queryObj?.sortBy && queryObj?.sortOrder) {
    sort = { [queryObj.sortBy as string]: queryObj.sortOrder }
  }
  const sorting = pagination.sort(sort)

  //Filtering
  if (queryObj?.minPrice && queryObj?.maxPrice) {
    queryObj['price'] = {
      $gte: Number(queryObj?.minPrice),
      $lte: Number(queryObj?.maxPrice),
    }
  }
  //if filter with only min price
  else if (queryObj?.minPrice) {
    queryObj['price'] = {
      $gte: Number(queryObj?.minPrice),
    }
  }
  //if filter with only max price
  else if (queryObj?.maxPrice) {
    queryObj['price'] = {
      $lte: Number(queryObj?.maxPrice),
    }
  }

  if (queryObj?.tags) {
    queryObj['tags.name'] = queryObj?.tags
  }
  if (queryObj?.startDate) {
    queryObj['startDate'] = {
      $gte: queryObj?.startDate,
    }
  }
  if (queryObj?.endDate) {
    queryObj['endDate'] = {
      $lte: queryObj?.endDate,
    }
  }
  if (queryObj?.level) {
    queryObj['details.level'] = queryObj?.level
  }

  // deleted unnecessary element
  excludeFields.forEach((element) => delete queryObj[element])

  const result = await sorting.find(queryObj).populate('createdBy')
  const meta = {
    page,
    limit,
    total: result?.length,
  }
  return { meta, result }
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const find = await Course.findOne({ _id: id })
  const { tags, details, ...remainingData } = payload
  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    //update Primitive Data
    if (remainingData?.startDate) {
      const startDate = new Date(remainingData?.startDate)
      const endDate = new Date(find?.endDate as string)
      const time = endDate.getTime() - startDate.getTime()
      const days = time / (1000 * 3600 * 24)
      const durationInWeeks = Math.ceil(days / 7)
      remainingData.durationInWeeks = durationInWeeks
    } else if (remainingData?.endDate) {
      const startDate = new Date(find?.startDate as string)
      const endDate = new Date(remainingData?.endDate)
      const time = endDate.getTime() - startDate.getTime()
      const days = time / (1000 * 3600 * 24)
      const durationInWeeks = Math.ceil(days / 7)
      remainingData.durationInWeeks = durationInWeeks
    }
    if (remainingData?.startDate && remainingData?.endDate) {
      const startDate = new Date(remainingData?.startDate as string)
      const endDate = new Date(remainingData?.endDate as string)
      const time = endDate.getTime() - startDate.getTime()
      const days = time / (1000 * 3600 * 24)
      const durationInWeeks = Math.ceil(days / 7)
      remainingData.durationInWeeks = durationInWeeks
    }
    const basicFieldUpdate = await Course.findOneAndUpdate(
      { _id: id },
      remainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    )
    if (!basicFieldUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
    }

    //update array of tags
    if (tags && tags?.length > 0) {
      const deleteTags = tags
        .filter((td) => td?.name && td.isDeleted)
        .map((td) => td?.name)
      const deletedTags = await Course.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            tags: { name: { $in: deleteTags } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
      if (!deletedTags) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
      }
      const newTag = tags?.filter((td) => td?.name && !td?.isDeleted)
      const newTags = await Course.findOneAndUpdate(
        { _id: id },
        {
          $addToSet: {
            tags: { $each: newTag },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
      if (!newTags) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
      }
    }

    //update details object
    if (details && Object.keys(details).length) {
      const update: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(details)) {
        update[`details.${key}`] = value
      }
      const updateDetails = await Course.findOneAndUpdate({ _id: id }, update, {
        new: true,
        runValidators: true,
        session,
      })
      if (!updateDetails) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
      }
    }
    await session.commitTransaction()
    await session.endSession()

    //Finally Send the updated data
    const result = await Course.findById(id).populate('createdBy')
    return result
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course')
  }
}

const getCourseWithReviewFromDB = async (id: string) => {
  const reviews = await Review.find({ courseId: id }).populate('createdBy')
  const course = await Course.findById(id).populate('createdBy')
  return { course, reviews }
}

const getBestCourseFromDB = async () => {
  const average = await Review.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ])
  let bestRating = {
    _id: '',
    averageRating: 0,
    reviewCount: 0,
  }
  if (average?.length > 0) {
    for (const best of average) {
      if (best.averageRating > bestRating?.averageRating) {
        bestRating = best
      }
    }
  }

  const bestCourse = await Course.findById(bestRating?._id).populate(
    'createdBy',
  )
  return {
    course: bestCourse,
    averageRating: bestRating?.averageRating,
    reviewCount: bestRating?.reviewCount,
  }
}

export const courseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  updateCourseIntoDB,
  getCourseWithReviewFromDB,
  getBestCourseFromDB,
}
