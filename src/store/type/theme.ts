export interface ThemeState {
  theme: 'light' | 'dark'
}

export interface ThemeActions {
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

export type ThemeStore = ThemeState & ThemeActions