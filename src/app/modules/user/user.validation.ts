import { z } from 'zod'

const userValiidationSchema = z.object({
  username: z.string({
    required_error: 'username is required',
  }),
  email: z
    .string({
      required_error: 'email is required',
    })
    .email(),
  password: z.string({
    required_error: 'password is required',
  }),
  role: z.enum(['user', 'admin']).default('user'),
})

export const userValidation = {
  userValiidationSchema,
}
