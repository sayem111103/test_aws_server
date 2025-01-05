import mongoose from 'mongoose'

export const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        name: val?.name
      }
    },
  )
  return errors
}
