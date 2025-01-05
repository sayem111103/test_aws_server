import { Schema, model } from 'mongoose'
import { Tcategory } from './category.interface'

const categorySchema = new Schema<Tcategory>(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
  },
)

export const Category = model<Tcategory>('Category', categorySchema)
