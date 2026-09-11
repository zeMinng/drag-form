import { useThemeStore } from '@/store/modules/theme'

/**
 * 主题相关的自定义 Hook
 * 提供便捷的主题状态访问和操作方法
 */
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore()
  
  return {
    // 主题状态
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    
    // 主题操作
    setTheme,
    toggleTheme,
    
    // 便捷方法
    setDarkTheme: () => setTheme('dark'),
    setLightTheme: () => setTheme('light'),
  }
}

export default useTheme
