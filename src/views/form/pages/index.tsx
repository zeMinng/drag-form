import React, { useState, useEffect } from 'react'
import IconFont from '@/components/Icon'
import Left from "./left"
import Center from "./center"
import Right from "./right"
import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useFormStore, type CenterItem } from '@/store/modules/form'

import './index.scss'

interface DraggingItem {
  type: string
  key: string
  title: string
  description: string
  icon?: string
}

// 拖拽覆盖层组件
const DragOverlayItem: React.FC<{ item: DraggingItem }> = ({ item }) => (
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
      {item.icon ? <IconFont type={item.icon} /> : null}
    </span>
    <div style={{ marginLeft: 8 }}>
      <div style={{ fontWeight: 500, marginBottom: 8 }}>{item.title}</div>
      <div style={{ fontSize: 12, color: '#888' }}>{item.description}</div>
    </div>
  </div>
)

const Form: React.FC = () => {
  const { centerItems, addCenterItem } = useFormStore()
  const setCenterItems = (items: CenterItem[]) => useFormStore.setState({ centerItems: items })
  const [draggingItem, setDraggingItem] = useState<DraggingItem | null>(null)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  
  // 配置传感器，需要移动一定距离才开始拖拽
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要移动8px才开始拖拽
      },
    })
  )
  
  // 移除调试代码，生产环境不需要
  useEffect(() => {
    if (!import.meta.env.PROD) {
      console.log('%c [ 缓存的拖动数组 ]', 'font-size:12px; background:red; color:#fff;', centerItems)
    }
  }, [centerItems])
  
  // 处理拖拽开始
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    
    // 只处理从左侧拖入的新组件，不显示center内部排序的拖拽覆盖层
    if (active.data.current && active.data.current.type === 'component') {
      setDraggingItem(event.active.data.current as DraggingItem)
    } else {
      // center内部的排序拖拽 - 不显示拖拽覆盖层
      setDraggingItem(null)
    }
    setInsertIndex(null)
  }

  // 计算插入位置
  const calculateInsertIndex = (overId: string | number): number | null => {
    const targetIndex = centerItems.findIndex((item: CenterItem) => item.id === overId)
    if (targetIndex !== -1) {
      return targetIndex
    } else if (overId === 'center-drop-area') {
      return centerItems.length
    }
    return null
  }

  // 处理拖拽过程中
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    // 只处理从左侧拖入的新组件
    if (active.data.current && active.data.current.type === 'component' && over) {
      const insertIndex = calculateInsertIndex(over.id)
      setInsertIndex(insertIndex)
      setIsDraggingOver(true)
    } else {
      setInsertIndex(null)
      // 只有在没有拖拽到任何有效目标时才关闭边框
      if (!over || (over.id !== 'center-drop-area' && !centerItems.find(item => item.id === over.id))) {
        setIsDraggingOver(false)
      }
    }
  }

  // 创建新项目
  const createNewItem = (data: DraggingItem): Omit<CenterItem, 'id'> => ({
    type: data.key,
    title: data.title,
    description: data.description,
    icon: data.icon,
  })

  // 处理从左侧拖入新组件
  const handleNewComponentDrop = (newItem: Omit<CenterItem, 'id'>, overId: string | number) => {
    const targetIndex = centerItems.findIndex((item: CenterItem) => item.id === overId)
    
    if (targetIndex !== -1) {
      // 插入到指定位置
      const newItems = [...centerItems]
      const itemWithId = { ...newItem, id: `new-${Date.now()}` }
      newItems.splice(targetIndex, 0, itemWithId)
      setCenterItems(newItems)
    } else if (overId === 'center-drop-area') {
      // 添加到末尾
      addCenterItem(newItem)
    }
  }

  // 处理内部排序
  const handleInternalSort = (activeId: string | number, overId: string | number) => {
    const oldIndex = centerItems.findIndex((item: CenterItem) => item.id === activeId)
    const newIndex = centerItems.findIndex((item: CenterItem) => item.id === overId)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = [...centerItems]
      const [movedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, movedItem)
      setCenterItems(newItems)
    }
  }

  // 处理拖拽结束 - 处理从左侧拖入新组件和内部排序
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggingItem(null)
    setInsertIndex(null)
    setIsDraggingOver(false)
    
    if (!over) return
    
    // 处理从左侧拖入的新组件
    if (active.data.current && active.data.current.type === 'component') {
      const newItem = createNewItem(active.data.current as DraggingItem)
      handleNewComponentDrop(newItem, over.id)
      return
    }
    
    // 处理内部排序
    if (active.id !== over.id) {
      handleInternalSort(active.id, over.id)
    }
  }

  // 处理拖拽取消
  const handleDragCancel = () => {
    setDraggingItem(null)
    setInsertIndex(null)
    setIsDraggingOver(false)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="formWrap flex">
        <div className="leftPanel">
          <Left />
        </div>
        <div className="centerPanel flex-1">
          <SortableContext
            items={centerItems.map((item: any) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Center insertIndex={insertIndex} isDraggingOver={isDraggingOver} />
          </SortableContext>
        </div>
        <div className="rightPanel">
          <Right />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {draggingItem ? <DragOverlayItem item={draggingItem} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Form
