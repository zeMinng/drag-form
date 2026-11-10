import { useRouteError } from 'react-router-dom'
import { ErrorBoundaryComponent } from './src/index'

export const ErrorThrower = () => {
  const error = useRouteError()
  throw error
}

export default ErrorBoundaryComponent
