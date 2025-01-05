import { Tcategory } from './category.interface'
import { Category } from './category.model'

const createCategoryIntoDB = async (payload: Tcategory) => {
  const newCategory = await Category.create(payload)
  return newCategory
}

const getAllCategoryFromDB = async () => {
  const allCategory = await Category.find().populate('createdBy')
  return allCategory
}
export const categoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
}
