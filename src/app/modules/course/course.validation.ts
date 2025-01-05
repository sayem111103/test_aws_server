import { z } from 'zod'
const tagsValidationSchema = z.object({
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
})
const createCourseValidationSchema = z.object({
  title: z.string({
    required_error: 'title is required',
    invalid_type_error: 'title must be a string',
  }),
  instructor: z.string({
    required_error: 'instructor is required',
    invalid_type_error: 'instructor must be a string',
  }),
  price: z.number({
    required_error: 'price is required',
    invalid_type_error: 'price must be a number',
  }),
  tags: z.array(tagsValidationSchema, {
    required_error: 'tags is required',
    invalid_type_error: 'tags must be a string',
  }),
  startDate: z.string({
    required_error: 'startDate is required',
    invalid_type_error: 'startDate must be a string',
  }),
  endDate: z.string({
    required_error: 'endDate is required',
    invalid_type_error: 'endDate must be a string',
  }),
  language: z.string({
    required_error: 'language is required',
    invalid_type_error: 'language must be a string',
  }),
  provider: z.string({
    required_error: 'provider is required',
    invalid_type_error: 'provider must be a string',
  }),
  details: z.object(
    {
      level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
        required_error: 'level is required',
        invalid_type_error: 'level must be a string',
      }),
      description: z.string({
        required_error: 'description is required',
        invalid_type_error: 'description must be a string',
      }),
    },
    {
      required_error: 'details is required',
      invalid_type_error: 'details must be a number',
    },
  ),
})

const tagsUpdateValidationSchema = z.object({
  name: z.string().optional(),
})

const courseUpdateValidationSchema = z.object({
  title: z.string().optional(),
  instructor: z.string().optional(),
  price: z.number().optional(),
  tags: z.array(tagsUpdateValidationSchema).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  details: z
    .object({
      level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
      description: z.string().optional(),
    })
    .optional(),
})

export const courseValidation = {
  createCourseValidationSchema,
  courseUpdateValidationSchema,
}
