import { createPersistedStore } from '@/store'
import type { ThemeStore } from '@/store/type'

export const useThemeStore = createPersistedStore<ThemeStore>(
  'theme',
  (set, _get, _api) => ({
    theme: 'light',

    setTheme: (theme) => {
      set({ theme })
      
      // 应用主题到 DOM
      if (typeof window !== 'undefined') {
        const root = document.documentElement
        
        // 移除之前的主题类
        root.classList.remove('light', 'dark')
        
        // 添加当前主题类
        root.classList.add(theme)
        
        // 设置 data-theme 属性
        root.setAttribute('data-theme', theme)
      }
    }
  })
)