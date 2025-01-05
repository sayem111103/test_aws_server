import { z } from 'zod'

const authvalidationschema = z.object({
  username: z.string({
    required_error: 'username is required',
  }),
  password: z.string({
    required_error: 'password is required',
  }),
})
const authPasswordChangevalidationschema = z.object({
  currentPassword: z.string({
    required_error: 'currentPassword is required',
  }),
  newPassword: z.string({
    required_error: 'newPassword is required',
  }),
})

export const authvalidation = {
  authvalidationschema,
  authPasswordChangevalidationschema,
}
