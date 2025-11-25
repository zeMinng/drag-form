import React, { Suspense } from 'react'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import Router from './router'
import { useTheme } from './hooks/useTheme'
import ErrorBoundary from './components/ErrorBoundary'

import './App.css'
// const LazyComponent = React.lazy(() => new Promise(() => {})) // 永远不resolve
// token: { colorPrimary: '#7c3aed' }

const App: React.FC = () => {
  const { isDark } = useTheme()

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntdApp> 
        <ErrorBoundary>
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
        </ErrorBoundary>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App