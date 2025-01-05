import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'

export const validatation = (validationSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validationSchema.parseAsync(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }
}
