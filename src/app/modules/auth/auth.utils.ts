import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
export const createAccessToken = (
  jwtPayload: {
    _id: Types.ObjectId | undefined
    role: string | undefined
    email: string | undefined
    username: string | undefined
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn })
}
