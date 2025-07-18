import { createPersistedStore } from '@/store'
import { v4 as uuidv4 } from 'uuid'

export interface CenterItem {
  id: string
  type: string
  title: string
  description?: string
  icon?: string
}

interface FormState {
  centerItems: CenterItem[]
  addCenterItem: (item: CenterItem) => void
}

export const useFormStore = createPersistedStore<FormState>(
  'form',
  (set, _get, _api) => ({
    centerItems: [],
    addCenterItem: (item) =>
      set((state) => ({
        centerItems: [...state.centerItems, { ...item, id: uuidv4().substring(0, 8) }]
      }
    )),
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