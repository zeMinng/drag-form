import React, { Suspense } from 'react'
import Router from './router'
import { ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { useThemeStore } from './store/modules/theme'
import './App.css'
// const LazyComponent = React.lazy(() => new Promise(() => {})) // 永远不resolve
// token: { colorPrimary: '#7c3aed' }

const App: React.FC = () => {
  const { theme } = useThemeStore()
  const isDarkMode = theme === 'dark'

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <div className="app">
        {/* Suspense 用于懒加载时显示加载中状态 */}
        <Suspense fallback={
          <div className="center-loading">
            {/* <Spin size="large" /> */}
            <div className="loading-title">DragVueForm</div>
          </div>
        }>
          {/* <LazyComponent /> */}
          <Router />
        </Suspense>
      </div>
    </ConfigProvider>
  )
}

export default App