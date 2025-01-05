import { z } from 'zod'

const reviewValidationSchema = z.object({
  rating: z
    .number({
      required_error: 'rating is required',
      invalid_type_error: 'rating must be a number',
    })
    .min(1, { message: 'Must be 1 or more characters long' })
    .max(5, { message: 'Must be 5 or fewer characters long' }),
  review: z.string({
    required_error: 'review is required',
    invalid_type_error: 'review must be a string',
  }),
})

export const reviewValidation = {
  reviewValidationSchema,
}
