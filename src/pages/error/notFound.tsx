import { useNavigate } from 'react-router-dom'
import IconFont from '@/components/business/Icon'
import { APP_TITLE } from '@/constants/index.ts'
import './notFound.scss'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  // 装饰图标配置
  const icons = [
    { type: 'icon-code1', class: 'icon-1' },
    { type: 'icon-puzzle', class: 'icon-2' },
    { type: 'icon-link', class: 'icon-3' },
    { type: 'icon-arrow-right', class: 'icon-4' },
  ]

  return (
    <div className="notfound-container">
      {/* 装饰性图标 */}
      {icons.map((item, i) => (
        <div key={i} className={`decorative-icon ${item.class}`}>
          <IconFont type={item.type} />
        </div>
      ))}

      {/* 顶部装饰条 */}
      <div className="top-accent"></div>
      <div className="error-content">
        <div className="error-code" aria-label="404 错误">
          404
        </div>
        <h1 className="error-title">页面找不到了</h1>
        <p className="error-desc">
          抱歉，你访问的页面不存在、已被删除或暂时无法访问
          <br />
          请检查网址是否正确，或尝试其他操作
        </p>

        <div className="btn-group">
          <button
            className="error-btn btn-primary"
            onClick={() => navigate('/', { replace: true })}
          >
            回到首页
          </button>
        </div>
      </div>

      {/* 版权信息 */}
      <div className="copyright">
        © 2025
        {new Date().getFullYear() > 2025 && `-${new Date().getFullYear()}`}{' '}
        zeMing | {APP_TITLE}. 保留所有权利
      </div>
    </div>
  )
}

export default NotFound
