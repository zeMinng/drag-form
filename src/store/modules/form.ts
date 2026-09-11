import { createPersistedStore } from '@/store'
import { v4 as uuidv4 } from 'uuid'
import { defaultFormConfig } from '@/store/constants'
import type { FormStore } from '@/store/type'

/**
 * 表单状态管理
 * 使用模块化设计，类型和常量分离到独立文件夹
 */
export const useFormStore = createPersistedStore<FormStore>(
  'form',
  (set, get, _api) => ({
    // 初始状态
    centerItems: [],
    selectedItemId: null,
    formConfig: defaultFormConfig,
    
    // 操作方法 - 优化后的写法
    addCenterItem: (item) => {
      if (!item || !item.type) {
        console.warn('添加组件项失败：无效的组件数据')
        return
      }
      const assignIdsRecursively = (node: any): any => {
        // const newId = uuidv4().substring(0, 3)
        const newId = uuidv4().replace(/[^a-zA-Z]/g, '').slice(0, 3)
        const hasChildren = Array.isArray(node.children) && node.children.length > 0
        return {
          ...node,
          id: newId,
          children: hasChildren ? node.children.map((child: any) => assignIdsRecursively(child)) : node.children
        }
      }
      const itemWithIds = assignIdsRecursively(item)
      set((state) => ({
        centerItems: [...state.centerItems, itemWithIds]
      }))
    },
    
    updateCenterItem: (id, updates) => {
      if (!id || !updates) {
        console.warn('更新组件项失败：无效的参数')
        return
      }

      const updateInTree = (items: any[]): any[] => {
        return items.map((node) => {
          if (node.id === id) {
            return { ...node, ...updates }
          }
          if (Array.isArray(node.children) && node.children.length) {
            return { ...node, children: updateInTree(node.children) }
          }
          return node
        })
      }

      set((state) => ({
        centerItems: updateInTree(state.centerItems)
      }))
    },
    
    updateItems: (items) => set({ centerItems: items }),
    
    removeCenterItem: (id) => {
      if (!id) {
        console.warn('删除组件项失败：无效的ID')
        return
      }

      const removeFromTree = (items: any[]): any[] => {
        return items
          .filter((node) => node.id !== id)
          .map((node) => {
            if (Array.isArray(node.children) && node.children.length) {
              return { ...node, children: removeFromTree(node.children) }
            }
            return node
          })
      }

      set((state) => ({
        centerItems: removeFromTree(state.centerItems),
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
      }))
    },
    
    setSelectedItemId: (id) => set({ selectedItemId: id }),
    
    getSelectedItem: () => {
      const state = get()
      const selectedId = state.selectedItemId
      if (!selectedId) return null

      const findInTree = (items: any[]): any | null => {
        for (const node of items) {
          if (node.id === selectedId) return node
          if (Array.isArray(node.children) && node.children.length) {
            const found = findInTree(node.children)
            if (found) return found
          }
        }
        return null
      }

      return findInTree(state.centerItems)
    },
    
    updateFormConfig: (config) => {
      if (!config || typeof config !== 'object') {
        console.warn('更新表单配置失败：无效的配置数据')
        return
      }
      set((state) => ({
        formConfig: { ...state.formConfig, ...config }
      }))
    },
    
    resetFormConfig: () => set({ formConfig: defaultFormConfig }),
  })
)

// 重新导出类型，保持向后兼容
export type { CenterItem, FormConfig, FormState, FormActions } from '@/store/type'
export { defaultFormConfig } from '@/store/constants'
