import { createPersistedStore } from '@/store'
import type { ThemeStore } from '@/store/type'

// 应用主题到 DOM 的辅助函数
const applyThemeToDOM = (theme: 'light' | 'dark') => {
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

export const useThemeStore = createPersistedStore<ThemeStore>(
  'theme',
  (set, get, _api) => ({
    theme: 'light',

    setTheme: (theme) => {
      set({ theme })
      applyThemeToDOM(theme)
    },

    toggleTheme: () => {
      const currentTheme = get().theme
      const newTheme = currentTheme === 'light' ? 'dark' : 'light'
      get().setTheme(newTheme)
    }
  }),
  {
    onRehydrateStorage: () => (state) => {
      // 当从 localStorage 恢复数据后，立即应用主题到 DOM
      if (state?.theme) {
        applyThemeToDOM(state.theme)
      }
    }
  }
)