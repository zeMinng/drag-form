import type { RouteObject } from 'react-router-dom'
import { ErrorThrower } from '@/components/common/ErrorBoundary'
import Layout from '@/components/layouts'
import { Form, NotFound } from './remaining.lazy'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorThrower />,
    children: [
      {
        index: true,
        element: <Form />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <ErrorThrower />,
  },
]

export default routes
