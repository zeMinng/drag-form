import React, { Suspense } from 'react'
import Router from './router'
import { Spin } from 'antd'
import './App.css'
// const LazyComponent = React.lazy(() => new Promise(() => {})); // 永远不resolve

const App: React.FC = () => (
  <div className="app">
    {/* Suspense 用于懒加载时显示加载中状态 */}
    <Suspense fallback={
      <div className="center-loading">
        <Spin size="large" />
      </div>
    }>
      {/* <LazyComponent /> */}
      <Router />
    </Suspense>
  </div>
)

export default App
