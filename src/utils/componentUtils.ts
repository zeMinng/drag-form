import React from 'react'
import { getComponentConfig } from './componentRegistry'
import type { FormComponent } from '@/types/component'

// 根据组件类型渲染组件
export const renderComponent = (item: FormComponent) => {
  const config = getComponentConfig(item.type)
  
  if (!config) {
    return React.createElement('div', {}, `未知组件类型: ${item.type}`)
  }
  
  const Component = config.component
  
  // 合并默认属性和自定义属性
  const mergedProps = { ...config.props, ...item.props }
  
  return React.createElement(Component, mergedProps, config.children)
}

// 渲染布局组件
export const renderLayoutComponent = (item: FormComponent, children?: React.ReactNode) => {
  const config = getComponentConfig(item.type)
  
  if (!config) {
    return React.createElement('div', {}, `未知布局组件: ${item.type}`)
  }
  
  const Component = config.component
  
  // 合并默认属性和自定义属性
  const mergedProps = { ...config.props, ...item.props }
  
  return React.createElement(Component, mergedProps, children || config.children)
} 