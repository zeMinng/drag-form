import { Modal } from 'antd'
import { DeleteOutlined, EyeOutlined, PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import { DndContext, useDroppable, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { useFormStore } from '@/store/modules/form'
import '../style/Center.scss'

const clearTheCanvas = () => {
  Modal.confirm({
    title: '提示',
    content: '确定要清空画布吗？',
    centered: true,
    onOk: () => {
      useFormStore.setState({
        centerItems: [],
      })
    },
  })
}

const save = () => {
  Modal.confirm({
    title: '提示',
    content: '草泥马',
    centered: true,
  })
}

const CenterTop: React.FC = () => {
  return (
    <div className="centerTop">
      <Flex gap="small" wrap>
        <Button icon={<DeleteOutlined />} color="danger" variant="filled" onClick={() => clearTheCanvas()}>
          清空画布
        </Button>
        <Button icon={<EyeOutlined />} color="cyan" variant="filled">
          查看JSON
        </Button>
        <Button icon={<DownloadOutlined />} color="primary" variant="filled">
          导出Vue文件
        </Button>
        <Button icon={<PlayCircleOutlined />} color="primary" variant="filled" onClick={() => save()}>
          运行
        </Button>
      </Flex>
    </div>
  )
}

// 插入指示器组件
const InsertIndicator: React.FC<{ isVisible: boolean; position: 'top' | 'bottom' }> = ({ isVisible, position }) => {
  if (!isVisible) return null
  return (
    <div className={`insert-indicator insert-${position}`}>
      <div className="insert-line"></div>
      <div className="insert-dot"></div>
    </div>
  )
}

// SortableItem 组件
const SortableItem: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="center-item">
      <i className={`iconfont ${item.icon}`} /> {item.title}
    </div>
  )
}

const Center: React.FC = () => {
  const { centerItems, addCenterItem } = useFormStore()
  const setCenterItems = (items: any[]) => useFormStore.setState({ centerItems: items })
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // 拖拽结束处理
  const handleDragEnd = (event: any) => {
    const { active, over } = event
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
      if (over.id === 'center-drop-area') {
        addCenterItem(newItem)
        return
      }
      
      // 如果拖到了某个项目上，根据鼠标位置决定插入位置
      const targetIndex = centerItems.findIndex((item: any) => item.id === over.id)
      if (targetIndex !== -1) {
        const newItems = [...centerItems]
        // 默认插入到目标项目之前
        newItems.splice(targetIndex, 0, newItem)
        setCenterItems(newItems)
        return
      }
    }
    
    // 处理内部排序
    if (active.id === over.id) return
    const oldIndex = centerItems.findIndex((item: any) => item.id === active.id)
    const newIndex = centerItems.findIndex((item: any) => item.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      setCenterItems(arrayMove(centerItems, oldIndex, newIndex))
    }
  }

  return (
    <div className='centerWrap'>
      <CenterTop />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[
          // 只允许纵向拖拽（X 始终固定）
          restrictToVerticalAxis,
          // 并且不允许移动出父容器
          restrictToParentElement,
        ]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={centerItems.map((item: any) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={setNodeRef}
            className="center-container"
            style={{
              border: isOver ? '2px dashed #1890ff' : '2px dashed #eee',
              minHeight: 120,
            }}
          >
            {centerItems.length === 0 ? (
              <div className="center-placeholder">请从左侧拖拽组件到这里</div>
            ) : (
              centerItems.map((item: any, index: number) => (
                <SortableItem key={item.id} item={item} index={index} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default Center
