import IconFont from '@/components/Icon'
import Left from "./components/Left"
import Center from "./components/Center"
import Right from "./components/Right"
import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragStartEvent } from '@dnd-kit/core'
import { useFormStore } from '@/store/modules/form'

import './index.scss'

const Form: React.FC = () => {
  const addCenterItem = useFormStore(state => state.addCenterItem)
  const [draggingItem, setDraggingItem] = useState<any>(null)

  // 处理拖拽开始
  const handleDragStart = (event: DragStartEvent) => {
    setDraggingItem(event.active.data.current)
  }

  // 处理拖拽结束
  const handleDragEnd = (event: any) => {
    const { over, active } = event
    if (over && over.id === 'center-drop-area' && active.data.current) {
      addCenterItem(active.data.current)
    }
  }

  // 处理拖拽取消
  const handleDragCancel = () => {
    setDraggingItem(null)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="formWrap flex">
        <div className="leftPanel">
          <Left />
        </div>
        <div className="centerPanel flex-1">
          <Center />
        </div>
        <div className="rightPanel">
          <Right />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {draggingItem ? (
          <div
            className="left-list-item"
            style={{
              opacity: 0.8,
              cursor: 'grab',
              background: '#fff',
              border: '1px solid #1890ff',
              boxShadow: '0 2px 8px rgba(24,144,255,0.3)',
              padding: '8px',
              marginBottom: '8px',
              borderRadius: '4px',
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className="left-list-icon" style={{ background: '#f1f5f9', borderRadius: 4, padding: 4, marginRight: 8 }}>
              {draggingItem.icon ? (
                <IconFont type={draggingItem.icon || ''} />
              ) : null}
            </span>
            <div style={{ marginLeft: 8 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>{draggingItem.title}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{draggingItem.description}</div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Form
