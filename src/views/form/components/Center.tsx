import React from 'react'
import { Modal } from 'antd'
import { DeleteOutlined, EyeOutlined, PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFormStore, type CenterItem } from '@/store/modules/form'
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
        <Button icon={<PlayCircleOutlined />} color="primary" variant="filled">
          运行
        </Button>
      </Flex>
    </div>
  )
}

// SortableItem 组件
const SortableItem: React.FC<{ item: CenterItem; index?: number }> = ({ item }) => {
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

interface CenterProps {
  insertIndex?: number | null
}

const Center: React.FC<CenterProps> = ({ insertIndex }) => {
  const { centerItems } = useFormStore()
  const setCenterItems = (items: any[]) => useFormStore.setState({ centerItems: items })
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  return (
    <div className='centerWrap'>
      <CenterTop />
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
          centerItems.map((item: CenterItem, index: number) => (
            <React.Fragment key={item.id}>
              {/* 在指定位置显示插入指示器 */}
              {insertIndex === index && (
                <div className="insert-indicator insert-top">
                  <div className="insert-line"></div>
                  <div className="insert-dot"></div>
                </div>
              )}
              <SortableItem item={item} index={index} />
            </React.Fragment>
          ))
        )}
        {/* 在末尾显示插入指示器 */}
        {insertIndex === centerItems.length && centerItems.length > 0 && (
          <div className="insert-indicator insert-bottom">
            <div className="insert-line"></div>
            <div className="insert-dot"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Center
