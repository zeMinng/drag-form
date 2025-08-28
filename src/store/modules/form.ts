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
    
    // 操作方法
    addCenterItem: (item) => set((state) => ({
      centerItems: [...state.centerItems, { ...item, id: uuidv4().substring(0, 8) }]
    })),
    
    updateCenterItem: (id, updates) => set((state) => ({
      centerItems: state.centerItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    })),
    
    updateItems: (items) => set(() => ({
      centerItems: items
    })),
    
    removeCenterItem: (id) => set((state) => ({
      centerItems: state.centerItems.filter(item => item.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
    })),
    
    setSelectedItemId: (id) => set(() => ({ selectedItemId: id })),
    
    getSelectedItem: () => {
      const state = get()
      return state.centerItems.find(item => item.id === state.selectedItemId) || null
    },
    
    updateFormConfig: (config) => set((state) => ({
      formConfig: { ...state.formConfig, ...config }
    })),
    
    resetFormConfig: () => set(() => ({
      formConfig: defaultFormConfig
    })),
  })
)

// 重新导出类型，保持向后兼容
export type { CenterItem, FormConfig, FormState, FormActions } from '@/store/type'
export { defaultFormConfig } from '@/store/constants'
