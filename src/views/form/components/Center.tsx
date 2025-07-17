import { useDroppable } from '@dnd-kit/core'
import { useFormStore } from '@/store/modules/form'

const Center: React.FC = () => {
  const { centerItems } = useFormStore()
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  return (
    <div
      ref={setNodeRef}
      className="center-container"
      style={{
        border: isOver ? '2px dashed #1890ff' : '2px dashed #eee',
        minHeight: 200,
        padding: 16,
      }}
    >
      {centerItems.length === 0 ? (
        <div className="center-placeholder">请从左侧拖拽组件到这里</div>
      ) : (
        centerItems.map((item) => (
          <div key={item.id} className="center-item">
            <i className={`iconfont ${item.icon}`} /> {item.title}
          </div>
        ))
      )}
    </div>
  )
}

export default Center