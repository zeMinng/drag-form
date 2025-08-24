import { useNavigate } from 'react-router-dom'
import './NotFound.scss'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">访问的页面被外星人吃掉了😁</p>
      <button className="notfound-button" onClick={() => navigate("/", { replace: true })}>
        返回首页
      </button>
    </div>
  )
}

export default NotFound
