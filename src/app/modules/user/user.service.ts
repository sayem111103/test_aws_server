import { TPassHistory, TUser } from './user.interface'
import { PasswordHistory, User } from './user.model'

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload)
  if (result) {
    const data: TPassHistory = {
      userId: result?._id,
      lastTwoPasswordHistory: [payload?.password],
    }
    await PasswordHistory.create(data)
  }
  return result
}

export const userServices = {
  createUserIntoDB,
}
