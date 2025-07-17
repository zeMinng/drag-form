import Left, { DraggableListItem } from "./components/Left"
import Center from "./components/Center"
import Right from "./components/Right"
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { useFormStore } from '@/store/modules/form'

import './index.scss'

const Form: React.FC = () => {
  const addCenterItem = useFormStore(state => state.addCenterItem)
  const [draggingItem, setDraggingItem] = useState<any>(null)

  // 处理拖拽开始
  const handleDragStart = (event: any) => {
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
          <DraggableListItem item={draggingItem} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Form
