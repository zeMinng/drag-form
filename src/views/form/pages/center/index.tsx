import React from 'react'
import { Modal, Flex, Button } from 'antd'
import { DeleteOutlined, EyeOutlined, PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import IconFont from '@/components/Icon'
import { useFormStore, type CenterItem } from '@/store/modules/form'
import { getComponentConfig } from '../../static/formComponents/formComponents'
import './index.scss'

const clearTheCanvas = () => {
  Modal.confirm({
    title: '提示',
    content: '确定要清空画布吗？',
    centered: true,
    onOk: () => {
      useFormStore.setState({
        centerItems: [],
        selectedItemId: null,
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

// 通用组件容器
const FormComponentWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="componentItem">
    <div className="itemTitle">{title}</div>
    <div className="itemContent">{children}</div>
  </div>
)

// 根据类型渲染对应的组件
const renderComponentByType = (item: CenterItem) => {
  const config = getComponentConfig(item.type)
  const Component = config.component
  
  // 合并默认属性和自定义属性
  const mergedProps = { ...config.props, ...item.props }
  
  return (
    <FormComponentWrapper title={item.title}>
      <Component {...mergedProps}>
        {config.children}
      </Component>
    </FormComponentWrapper>
  )
}

// SortableItem 组件
const SortableItem: React.FC<{ item: CenterItem; index?: number }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const { selectedItemId, setSelectedItemId, removeCenterItem } = useFormStore()
  
  const isSelected = selectedItemId === item.id
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  }
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 点击组件本身的任何地方都选中该组件
    setSelectedItemId(item.id)
  }

  // 删除中部指定元素
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeCenterItem(item.id)
  }
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`center-item ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {/* 删除按钮 */}
      <div 
        className="delete-btn"
        onClick={handleDelete}
        style={{
          display: isSelected ? 'flex' : 'none',
        }}
      >
        <IconFont type="icon-shanchu" />
      </div>
      <div className="componentWrap">
        {renderComponentByType(item)}
      </div>
    </div>
  )
}

interface CenterProps {
  insertIndex?: number | null
  isDraggingOver?: boolean
}

const Center: React.FC<CenterProps> = ({ insertIndex, isDraggingOver = false }) => {
  const { centerItems } = useFormStore()
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  // 点击空白区域取消选中
  const handleContainerClick = () => {
    // setSelectedItemId(null)
  }

  return (
    <div className='centerWrap'>
      <CenterTop />
      <div
        ref={setNodeRef}
        className="center-container"
        style={{
          border: (isOver || isDraggingOver) ? '2px dashed #1890ff' : '2px dashed #eee',
          minHeight: 120,
        }}
        onClick={handleContainerClick}
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
                  <div className="insert-dot">拖到这里</div>
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
            <div className="insert-dot">拖到这里</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Center
