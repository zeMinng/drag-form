import React, { Suspense } from 'react'
import Router from './router'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import './App.css'
// const LazyComponent = React.lazy(() => new Promise(() => {})); // 永远不resolve

const App: React.FC = () => (
  <ConfigProvider locale={zhCN}>
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

export default App