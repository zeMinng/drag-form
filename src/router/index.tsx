import { useRoutes } from 'react-router-dom'
import routes from './modules/remaining'

const Router: React.FC = () => {
  const routing = useRoutes(routes)
  return <>{routing}</>
}

export default Router
