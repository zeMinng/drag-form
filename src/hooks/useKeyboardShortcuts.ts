import { useEffect, useCallback } from 'react'
import { useFormStore } from '@/store/modules/form'

export const useKeyboardShortcuts = () => {
  const { removeCenterItem, getSelectedItem } = useFormStore()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Z: 撤销 (预留接口)
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      console.log('撤销功能待实现')
    }
    
    // Ctrl+Y: 重做 (预留接口)
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      console.log('重做功能待实现')
    }
    
    // Delete: 删除选中组件
    if (e.key === 'Delete') {
      e.preventDefault()
      const selectedItem = getSelectedItem()
      if (selectedItem) {
        removeCenterItem(selectedItem.id)
      }
    }

    // Ctrl+A: 全选 (预留接口)
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault()
      console.log('全选功能待实现')
    }

    // Ctrl+C: 复制 (预留接口)
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      console.log('复制功能待实现')
    }

    // Ctrl+V: 粘贴 (预留接口)
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault()
      console.log('粘贴功能待实现')
    }
  }, [removeCenterItem, getSelectedItem])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
