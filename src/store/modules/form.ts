import { createPersistedStore } from '@/store'
import { defaultFormConfig } from '@/store/constants'
import type { FormStore } from '@/store/type'
import { createCenterItem, findItemInTree, removeItemFromTree, updateItemInTree } from './formTree'

/**
 * 表单状态管理
 * 使用模块化设计，类型和常量分离到独立文件夹
 */
export const useFormStore = createPersistedStore<FormStore>('form', (set, get, _api) => ({
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
    const itemWithIds = createCenterItem(item)
    set((state) => ({
      centerItems: [...state.centerItems, itemWithIds],
    }))
  },

  updateCenterItem: (id, updates) => {
    if (!id || !updates) {
      console.warn('更新组件项失败：无效的参数')
      return
    }

    set((state) => ({
      centerItems: updateItemInTree(state.centerItems, id, updates),
    }))
  },

  updateItems: (items) => set({ centerItems: items }),

  removeCenterItem: (id) => {
    if (!id) {
      console.warn('删除组件项失败：无效的ID')
      return
    }

    set((state) => {
      const centerItems = removeItemFromTree(state.centerItems, id)
      const selectedItemId = state.selectedItemId

      return {
        centerItems,
        selectedItemId:
          selectedItemId && findItemInTree(centerItems, selectedItemId) ? selectedItemId : null,
      }
    })
  },

  setSelectedItemId: (id) => set({ selectedItemId: id }),

  getSelectedItem: () => {
    const state = get()
    const selectedId = state.selectedItemId
    if (!selectedId) return null

    return findItemInTree(state.centerItems, selectedId)
  },

  updateFormConfig: (config) => {
    if (!config || typeof config !== 'object') {
      console.warn('更新表单配置失败：无效的配置数据')
      return
    }
    set((state) => ({
      formConfig: { ...state.formConfig, ...config },
    }))
  },

  resetFormConfig: () => set({ formConfig: defaultFormConfig }),
}))

// 重新导出类型，保持向后兼容
export type { CenterItem, CenterItemDraft, FormConfig, FormState, FormActions } from '@/store/type'
export { defaultFormConfig } from '@/store/constants'
