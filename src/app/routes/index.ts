import { Router } from 'express'
import { courseroute } from '../modules/course/course.route'
import { categoryroute } from '../modules/category/category.route'
import { reviewroute } from '../modules/review/review.route'
import { userRoute } from '../modules/user/user.route'
import { authroute } from '../modules/auth/auth.route'

const  router = Router()

const moduleRoute = [
  {
    path: '/categories',
    route: categoryroute,
  },
  {
    path: '/course',
    route: courseroute,
  },
  {
    path: '/courses',
    route: courseroute,
  },
  {
    path: '/reviews',
    route: reviewroute,
  },
  {
    path: '/auth',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authroute,
  },
]

moduleRoute.forEach((routedata) => router.use(routedata.path, routedata.route))

export default router
