import { createPersistedStore } from '@/store'
import { v4 as uuidv4 } from 'uuid'

export interface CenterItem {
  id: string
  type: string
  title: string
  description?: string
  icon?: string
  props?: Record<string, any> // 组件属性
}

interface FormState {
  centerItems: CenterItem[]
  selectedItemId: string | null // 当前选中的组件ID
  addCenterItem: (item: Omit<CenterItem, 'id'>) => void
  updateCenterItem: (id: string, updates: Partial<CenterItem>) => void
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
