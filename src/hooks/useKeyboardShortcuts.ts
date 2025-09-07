import { useEffect, useRef, useCallback } from 'react'
import { message } from 'antd'
import type { CenterItem } from '@/store/modules/form'

export interface KeyboardShortcutsOptions {
  onDelete?: (item: CenterItem) => void
  onCopy?: (item: CenterItem) => void
  onPaste?: (item: CenterItem | null, targetItem: CenterItem | null) => void
  getSelectedItem: () => CenterItem | null
  shouldIgnoreInput?: (target: HTMLElement) => boolean
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions) => {
  const {
    onDelete,
    onCopy,
    onPaste,
    getSelectedItem,
    shouldIgnoreInput = (target) => {
      return target.closest('input, textarea, [contenteditable="true"]') !== null || 
             target.classList.contains('ant-input')
    }
  } = options

  const clipboardRef = useRef<CenterItem | null>(null)

  // 递归克隆节点并分配新 id
  const cloneItemWithNewIds = useCallback((node: CenterItem): CenterItem => {
    const newId = (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)).substring(0, 8)
    const clonedChildren = Array.isArray(node.children) ? node.children.map(cloneItemWithNewIds) : node.children
    return { ...node, id: newId, children: clonedChildren as any }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && shouldIgnoreInput(target)) {
        return
      }

      const selected = getSelectedItem()

      // 删除
      if (selected && (e.key === 'Delete' || e.key === 'Backspace')) {
        onDelete?.(selected)
        e.preventDefault()
        return
      }

      const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c'
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v'

      // 复制
      if (isCopy) {
        if (selected) {
          clipboardRef.current = selected
          message.success('已复制组件')
          onCopy?.(selected)
        }
        e.preventDefault()
        return
      }

      // 粘贴
      if (isPaste) {
        const source = clipboardRef.current
        if (source) {
          const cloned = cloneItemWithNewIds(source)
          onPaste?.(cloned, selected)
          message.success('已粘贴组件')
        }
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onDelete, onCopy, onPaste, getSelectedItem, shouldIgnoreInput, cloneItemWithNewIds])

  return {
    clipboardItem: clipboardRef.current
  }
}
