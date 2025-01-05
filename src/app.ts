import express, { Application } from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import router from './app/routes'
import { globalErrorHandler } from './app/middleware/globalErrorhandling'
import { notFound } from './app/middleware/routeNotFound'
export const app: Application = express()

//parser
app.use(express.json())
app.use(cors())

// routes
app.use('/api', router)

app.get('/', (req, res) => {
  res.send({
    success: true,
    statusCode: httpStatus.OK,
    message: 'hello!',
    data: [],
  })
})

app.use(globalErrorHandler)
app.use(notFound)
