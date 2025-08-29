import { useState, useCallback } from 'react'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'

// 拖拽状态接口
export interface DragState<T = any> {
  draggingItem: T | null
  insertIndex: number | null
  isDraggingOver: boolean
}

// 拖拽事件处理器接口
export interface DragHandlers {
  onDragStart?: (event: DragStartEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  onDragCancel?: () => void
}

// 拖拽 hook 返回值接口
export interface UseDragAndDropReturn<T = any> {
  dragState: DragState<T>
  resetDragState: () => void
  setDraggingItem: (item: T | null) => void
  setInsertIndex: (index: number | null) => void
  setIsDraggingOver: (isOver: boolean) => void
}

/**
 * 通用拖拽状态管理 hook
 * 不包含具体业务逻辑，只提供状态管理
 */
export const useDragAndDrop = <T = any>(): UseDragAndDropReturn<T> => {
  const [draggingItem, setDraggingItem] = useState<T | null>(null)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const resetDragState = useCallback(() => {
    setDraggingItem(null)
    setInsertIndex(null)
    setIsDraggingOver(false)
  }, [])

  return {
    dragState: {
      draggingItem,
      insertIndex,
      isDraggingOver,
    },
    resetDragState,
    setDraggingItem,
    setInsertIndex,
    setIsDraggingOver,
  }
}
