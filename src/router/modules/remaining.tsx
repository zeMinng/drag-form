import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import Layout from '@/layout'
const Form = lazy(() => import('@/views/form'))
const Md = lazy(() => import('@/views/md'))
const NotFound = lazy(() => import('@/views/error/notFound'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true, // 默认子路由
        element: <Form />,
      },
      {
        path: '/md',
        element: <Md />
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  }
]

export default routes
