import React from 'react'

// 组件包装器
export const ComponentWrapper: React.FC<{ 
  title: string
  children: React.ReactNode 
}> = ({ title, children }) => (
  <div className="componentItem">
    <div className="itemTitle">{title}</div>
    <div className="itemContent">{children}</div>
  </div>
)
