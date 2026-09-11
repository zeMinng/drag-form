import React, { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { router } from './router'
import { useTheme } from './hooks/useTheme'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import GlobalLoading from '@/components/common/GlobalLoading'
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
            <Suspense fallback={<GlobalLoading />}>
              {/* <LazyComponent /> */}
              <RouterProvider router={router} />
            </Suspense>
          </div>
        </ErrorBoundary>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App