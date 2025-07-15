import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import Layout from '@/layout'
const Home = lazy(() => import('@/views/system/home'))
const NotFound = lazy(() => import('@/views/error/notFound'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true, // 默认子路由
        element: <Home />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  }
]

export default routes
