import { createPersistedStore } from '@/store'

interface UserInfoState {
  name: string
  email?: string

  setName: (name: string) => void
  setEmail: (email: string) => void
}

export const useUserInfoStore = createPersistedStore<UserInfoState>(
  'userInfo',
  (set, _get, _api) => ({
    name: '',
    email: undefined,

    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
  })
)