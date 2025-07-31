import IconFont from '@/components/Icon'
import Left from "./components/Left"
import Center from "./components/Center"
import Right from "./components/Right"
import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragStartEvent } from '@dnd-kit/core'
import { useFormStore } from '@/store/modules/form'

import './index.scss'

const Form: React.FC = () => {
  const { centerItems, addCenterItem } = useFormStore()
  const setCenterItems = (items: any[]) => useFormStore.setState({ centerItems: items })
  const [draggingItem, setDraggingItem] = useState<any>(null)
  
  useEffect(() => {
    console.log('%c [ 缓存的拖动数组 ]', 'font-size:13px; background:pink; color:#bf2c9f;', centerItems)
  }, [centerItems])
  
  // 处理拖拽开始
  const handleDragStart = (event: DragStartEvent) => {
    setDraggingItem(event.active.data.current)
  }

  // 处理拖拽结束 - 处理从左侧拖入新组件
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setDraggingItem(null)
    
    if (!over) return
    
    // 处理从左侧拖入的新组件
    if (active.data.current && active.data.current.type === 'component') {
      const newItem = {
        id: `new-${Date.now()}`,
        type: active.data.current.key,
        title: active.data.current.title,
        description: active.data.current.description,
        icon: active.data.current.icon,
      }
      
      // 如果拖到了容器上，添加到末尾
      console.log('%c [ over ]-44', 'font-size:13px; background:pink; color:#bf2c9f;', over)
      if (over.id === 'center-drop-area') {
        addCenterItem(newItem)
        return
      }
      
      // 如果拖到了某个项目上，插入到该项目之前
      const targetIndex = centerItems.findIndex((item: any) => item.id === over.id)
      console.log('%c [ targetIndex ]-50', 'font-size:13px; background:pink; color:#bf2c9f;', targetIndex)
      if (targetIndex !== -1) {
        const newItems = [...centerItems]
        newItems.splice(targetIndex, 0, newItem)
        setCenterItems(newItems)
        return
      }
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
