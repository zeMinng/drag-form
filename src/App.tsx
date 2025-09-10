import React, { Suspense } from 'react'
import Router from './router'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import './App.css'
// const LazyComponent = React.lazy(() => new Promise(() => {})) // 永远不resolve
// token: { colorPrimary: '#7c3aed' }

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
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