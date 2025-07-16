import '../style/Center.scss'

const Center: React.FC = () => {
  return (
    <div className="center-container">
      {/* 这里将来渲染表单组件 */}
      <div className="center-placeholder">
        请从左侧拖拽组件到这里
      </div>
    </div>
  )
}

export default Center
