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
      const id = uuidv4().substring(0, 8)
      set((state) => ({
        centerItems: [...state.centerItems, { ...item, id }]
      }))
    },
    
    updateCenterItem: (id, updates) => {
      if (!id || !updates) {
        console.warn('更新组件项失败：无效的参数')
        return
      }
      set((state) => ({
        centerItems: state.centerItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      }))
    },
    
    updateItems: (items) => set({ centerItems: items }),
    
    removeCenterItem: (id) => {
      if (!id) {
        console.warn('删除组件项失败：无效的ID')
        return
      }
      set((state) => ({
        centerItems: state.centerItems.filter(item => item.id !== id),
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
      }))
    },
    
    setSelectedItemId: (id) => set({ selectedItemId: id }),
    
    getSelectedItem: () => {
      const state = get()
      const selectedId = state.selectedItemId
      if (!selectedId) return null
      // 优化：在数组较大时，使用一次 Map 缓存可以进一步优化，这里保持简单
      return state.centerItems.find(item => item.id === selectedId) || null
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
