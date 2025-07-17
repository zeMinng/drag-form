import '../style/Center.scss'
import { useUserInfoStore } from '@/store/modules/form'

const Center: React.FC = () => {
  const { name, email, setName, setEmail } = useUserInfoStore()

  return (
    <div className="center-container">
      {/* 这里将来渲染表单组件 */}
      <div className="center-placeholder">
        请从左侧拖拽组件到这里
        {name}
        <button onClick={() => setName('sd')}>sdffs</button>
      </div>
    </div>
  )
}

export default Center
