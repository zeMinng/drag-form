import { createPersistedStore } from '@/store'
import { v4 as uuidv4 } from 'uuid'
import type { FormComponent } from '@/views/form/static/type/component'

export interface CenterItem extends FormComponent {
  id: string
  type: string
  title: string
  description?: string
  icon?: string
  vmodel?: string // v-model字段名
  props?: Record<string, any> // 组件属性
}

interface FormState {
  centerItems: CenterItem[]
  selectedItemId: string | null // 当前选中的组件ID
  addCenterItem: (item: Omit<CenterItem, 'id'>) => void
  updateCenterItem: (id: string, updates: Partial<CenterItem>) => void
  updateCenterItems: (items: CenterItem[]) => void
  removeCenterItem: (id: string) => void
  setSelectedItemId: (id: string | null) => void
  getSelectedItem: () => CenterItem | null
}

export const useFormStore = createPersistedStore<FormState>(
  'form',
  (set, get, _api) => ({
    centerItems: [],
    selectedItemId: null,
    
    addCenterItem: (item) =>
      set((state) => ({
        centerItems: [...state.centerItems, { ...item, id: uuidv4().substring(0, 8) }]
      }
    )),
    
    updateCenterItem: (id, updates) =>
      set((state) => ({
        centerItems: state.centerItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      }
    )),
    
    updateCenterItems: (items) =>
      set((_state) => ({
        centerItems: items
      }
    )),
    
    removeCenterItem: (id) =>
      set((state) => ({
        centerItems: state.centerItems.filter(item => item.id !== id),
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
      }
    )),
    
    setSelectedItemId: (id) => set({ selectedItemId: id }),
    
    getSelectedItem: () => {
      const state = get()
      return state.centerItems.find(item => item.id === state.selectedItemId) || null
    },
  })
)
