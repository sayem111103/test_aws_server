import { Schema, model } from 'mongoose'
import { TCourse, Tdetails, Ttags } from './course.interface'

const tagsSchema = new Schema<Ttags>({
  name: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
})
const detailsSchema = new Schema<Tdetails>({
  level: {
    type: String,
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
    },
    required: true,
  },
  description: { type: String, required: true },
})
const courseSchema = new Schema<TCourse>({
  title: { type: String, required: true, unique: true },
  instructor: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
  price: { type: Number, required: true },
  tags: [tagsSchema],
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  language: { type: String, required: true },
  provider: { type: String, required: true },
  durationInWeeks: { type: Number, required: true },
  details: detailsSchema,
  createdBy: { type: Schema.Types.ObjectId, required: true, ref:'User' },
},{
  timestamps: true
})

export const Course = model<TCourse>('Course', courseSchema)
