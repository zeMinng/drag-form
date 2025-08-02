// 示例：如何使用新的组件配置系统

import React from 'react'
import { Input, TimePicker, Rate, Select } from 'antd'
import { registerComponent, updateComponentConfig, getComponentMeta } from './formComponents'

// 示例1：注册新的组件类型
export const registerCustomComponents = () => {
  // 注册时间选择器
  registerComponent('time', {
    component: TimePicker,
    props: { style: { width: '100%' }, placeholder: '请选择时间' },
    label: '时间选择',
    description: '时间选择器',
    icon: 'icon-time'
  })

  // 注册评分组件
  registerComponent('rate', {
    component: Rate,
    props: { defaultValue: 3 },
    label: '评分',
    description: '星级评分',
    icon: 'icon-rate'
  })

  // 注册密码输入框
  registerComponent('password', {
    component: Input.Password,
    props: { placeholder: '请输入密码' },
    label: '密码输入',
    description: '密码输入框',
    icon: 'icon-password'
  })
}

// 示例2：更新现有组件配置
export const updateExistingComponents = () => {
  // 更新输入框的占位符文本
  updateComponentConfig('input', {
    props: { placeholder: '请输入您的姓名' }
  })

  // 更新文本域的默认行数
  updateComponentConfig('textarea', {
    props: { placeholder: '请输入详细描述', rows: 5 }
  })
}

// 示例3：获取组件信息用于左侧面板
export const getComponentListForLeftPanel = () => {
  const componentTypes = ['input', 'textarea', 'select', 'radio', 'checkbox', 'date', 'switch', 'slider']
  
  return componentTypes.map(type => {
    const meta = getComponentMeta(type)
    return {
      key: type,
      type: 'component',
      title: meta.label,
      description: meta.description,
      icon: meta.icon
    }
  })
}

// 示例4：动态配置组件选项
export const createDynamicSelect = (options: Array<{ value: string; label: string }>) => {
  const children = options.map(option => 
    React.createElement(Select.Option, { 
      key: option.value, 
      value: option.value, 
      children: option.label 
    })
  )

  registerComponent('dynamic-select', {
    component: Select,
    props: { placeholder: '请选择', style: { width: '100%' } },
    children,
    label: '动态选择',
    description: '动态选项的下拉选择',
    icon: 'icon-dynamic-select'
  })
}

// 使用示例：
// 1. 在应用启动时注册自定义组件
// registerCustomComponents()

// 2. 根据需要更新组件配置
// updateExistingComponents()

// 3. 获取组件列表用于左侧面板
// const leftPanelItems = getComponentListForLeftPanel()

// 4. 动态创建带特定选项的选择框
// createDynamicSelect([
//   { value: 'male', label: '男' },
//   { value: 'female', label: '女' }
// ]) 