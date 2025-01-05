import { z } from "zod"

const categoryValidationSchema = z.object({
  name: z.string({
    required_error: 'name is required',
    invalid_type_error: 'name must be a string',
  }),
})

export const categoryValidation = { categoryValidationSchema }
