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
      })),
    
    setSelectedItemId: (id) => set({ selectedItemId: id }),
    
    getSelectedItem: () => {
      const state = get()
      return state.centerItems.find(item => item.id === state.selectedItemId) || null
    },
  })
)

// interface UserInfoState {
//   name: string
//   email?: string

//   setName: (name: string) => void
//   setEmail: (email: string) => void
// }

// export const useUserInfoStore = createPersistedStore<UserInfoState>(
//   'userInfo',
//   (set, _get, _api) => ({
//     name: '',
//     email: undefined,

//     setName: (name) => set({ name }),
//     setEmail: (email) => set({ email }),
//   })
// )