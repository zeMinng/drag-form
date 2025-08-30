import React, { useEffect, useCallback } from 'react'
import Left from "./left"
import Center from "./center"
import Right from "./right"
import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useFormStore, type CenterItem } from '@/store/modules/form'
import { DragOverlayItem } from '../components/DragOverlayItem'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import { DRAG_CONSTANTS, utils } from '../static/utils/commonUtils'

import './index.scss'

interface DraggingItem {
  type: string
  key: string
  title: string
  description: string
  icon?: string
}



const Form: React.FC = () => {
  const { centerItems, addCenterItem } = useFormStore()
  const setCenterItems = useCallback((items: CenterItem[]) => {
    useFormStore.setState({ centerItems: items })
  }, [])
  
  // 使用拖拽 hook 管理状态
  const {
    dragState: { draggingItem, insertIndex, isDraggingOver },
    resetDragState,
    setDraggingItem,
    setInsertIndex,
    setIsDraggingOver,
  } = useDragAndDrop<DraggingItem>()
  
  // 配置传感器，需要移动一定距离才开始拖拽
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_CONSTANTS.ACTIVATION_DISTANCE,
      },
    })
  )
  
  // 开发环境调试日志
  useEffect(() => {
    if (!import.meta.env.PROD) {
      console.log('%c [ 缓存的拖动数组 ]', 'font-size:12px; background:#42b983; color:#bada55;', centerItems)
    }
  }, [centerItems])
  
  // 计算插入位置
  const calculateInsertIndex = useCallback((overId: string | number): number | null => {
    const targetIndex = centerItems.findIndex((item: CenterItem) => item.id === overId)
    if (targetIndex !== -1) {
      return targetIndex
    } else if (overId === DRAG_CONSTANTS.CENTER_DROP_AREA_ID) {
      return centerItems.length
    }
    return null
  }, [centerItems])
  
  // 处理拖拽开始
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    
    // 只处理从左侧拖入的新组件，不显示center内部排序的拖拽覆盖层
    if (active.data.current?.type === DRAG_CONSTANTS.COMPONENT_TYPE) {
      setDraggingItem(active.data.current as DraggingItem)
    } else {
      // center内部的排序拖拽 - 不显示拖拽覆盖层
      setDraggingItem(null)
    }
    setInsertIndex(null)
  }, [setDraggingItem, setInsertIndex])

  // 处理拖拽过程中
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    
    // 只处理从左侧拖入的新组件
    if (active.data.current?.type === DRAG_CONSTANTS.COMPONENT_TYPE && over) {
      const insertIdx = calculateInsertIndex(over.id)
      setInsertIndex(insertIdx)
      setIsDraggingOver(true)
    } else {
      setInsertIndex(null)
      // 只有在没有拖拽到任何有效目标时才关闭边框
      const isValidTarget = over && (
        over.id === DRAG_CONSTANTS.CENTER_DROP_AREA_ID || 
        centerItems.some(item => item.id === over.id)
      )
      if (!isValidTarget) {
        setIsDraggingOver(false)
      }
    }
  }, [calculateInsertIndex, centerItems, setInsertIndex, setIsDraggingOver])

  // 创建新项目
  const createNewItem = useCallback((data: DraggingItem): Omit<CenterItem, 'id'> => ({
    type: data.key,
    title: data.title,
    description: data.description,
    icon: data.icon,
  }), [])

  // 处理从左侧拖入新组件
  const handleNewComponentDrop = useCallback((newItem: Omit<CenterItem, 'id'>, overId: string | number) => {
    const targetIndex = centerItems.findIndex((item: CenterItem) => item.id === overId)
    
    if (targetIndex !== -1) {
      // 插入到指定位置
      const newItems = [...centerItems]
      const itemWithId = { ...newItem, id: utils.generateId('new') }
      newItems.splice(targetIndex, 0, itemWithId)
      setCenterItems(newItems)
    } else if (overId === DRAG_CONSTANTS.CENTER_DROP_AREA_ID) {
      // 添加到末尾
      addCenterItem(newItem)
    }
  }, [centerItems, setCenterItems, addCenterItem])

  // 处理内部排序
  const handleInternalSort = useCallback((activeId: string | number, overId: string | number) => {
    const oldIndex = centerItems.findIndex((item: CenterItem) => item.id === activeId)
    const newIndex = centerItems.findIndex((item: CenterItem) => item.id === overId)

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const newItems = [...centerItems]
      const [movedItem] = newItems.splice(oldIndex, 1)
      newItems.splice(newIndex, 0, movedItem)
      setCenterItems(newItems)
    }
  }, [centerItems, setCenterItems])

  // 处理拖拽结束 - 处理从左侧拖入新组件和内部排序
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    resetDragState()
    
    if (!over) return
    
    // 处理从左侧拖入的新组件
    if (active.data.current?.type === DRAG_CONSTANTS.COMPONENT_TYPE) {
      const newItem = createNewItem(active.data.current as DraggingItem)
      handleNewComponentDrop(newItem, over.id)
      return
    }
    
    // 处理内部排序
    if (active.id !== over.id) {
      handleInternalSort(active.id, over.id)
    }
  }, [resetDragState, createNewItem, handleNewComponentDrop, handleInternalSort])

  // 处理拖拽取消
  const handleDragCancel = useCallback(() => {
    resetDragState()
  }, [resetDragState])

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
