import React from 'react'
import { Input, Select, Radio, Checkbox, DatePicker, Switch, Slider } from 'antd'

// 组件配置类型
export interface ComponentConfig {
  component: React.ComponentType<any>
  props?: Record<string, any>
  children?: React.ReactNode
  label?: string
  description?: string
  icon?: string
}

// 默认组件配置
const defaultConfigs: Record<string, ComponentConfig> = {
  input: {
    component: Input,
    props: { placeholder: '请输入内容' },
    label: '输入框',
    description: '单行文本输入',
    icon: 'icon-input'
  },
  textarea: {
    component: Input.TextArea,
    props: { placeholder: '请输入内容', rows: 3 },
    label: '多行输入',
    description: '多行文本输入',
    icon: 'icon-textarea'
  },
  select: {
    component: Select,
    props: { placeholder: '请选择', style: { width: '100%' } },
    children: [
      React.createElement(Select.Option, { key: 'option1', value: 'option1', children: '选项1' }),
      React.createElement(Select.Option, { key: 'option2', value: 'option2', children: '选项2' }),
      React.createElement(Select.Option, { key: 'option3', value: 'option3', children: '选项3' })
    ],
    label: '下拉选择',
    description: '下拉选择框',
    icon: 'icon-select'
  },
  radio: {
    component: Radio.Group,
    children: [
      React.createElement(Radio, { key: 'option1', value: 'option1' }, '选项1'),
      React.createElement(Radio, { key: 'option2', value: 'option2' }, '选项2'),
      React.createElement(Radio, { key: 'option3', value: 'option3' }, '选项3')
    ],
    label: '单选框',
    description: '单选按钮组',
    icon: 'icon-radio'
  },
  checkbox: {
    component: Checkbox.Group,
    children: [
      React.createElement(Checkbox, { key: 'option1', value: 'option1' }, '选项1'),
      React.createElement(Checkbox, { key: 'option2', value: 'option2' }, '选项2'),
      React.createElement(Checkbox, { key: 'option3', value: 'option3' }, '选项3')
    ],
    label: '复选框',
    description: '多选按钮组',
    icon: 'icon-checkbox'
  },
  date: {
    component: DatePicker,
    props: { style: { width: '100%' }, placeholder: '请选择日期' },
    label: '日期选择',
    description: '日期选择器',
    icon: 'icon-date'
  },
  switch: {
    component: Switch,
    label: '开关',
    description: '开关组件',
    icon: 'icon-switch'
  },
  slider: {
    component: Slider,
    props: { defaultValue: 30 },
    label: '滑块',
    description: '滑块组件',
    icon: 'icon-slider'
  }
}

// 组件配置映射（可动态修改）
let componentConfigs = { ...defaultConfigs }

// 获取组件配置
export const getComponentConfig = (type: string): ComponentConfig => {
  return componentConfigs[type] || componentConfigs.input
}

// 获取所有可用的组件类型
export const getAvailableComponentTypes = (): string[] => {
  return Object.keys(componentConfigs)
}

// 获取组件的元信息（用于左侧面板显示）
export const getComponentMeta = (type: string) => {
  const config = getComponentConfig(type)
  return {
    label: config.label || type,
    description: config.description || '',
    icon: config.icon || 'icon-default'
  }
}

// 注册新组件类型
export const registerComponent = (type: string, config: ComponentConfig) => {
  componentConfigs[type] = config
}

// 更新现有组件配置
export const updateComponentConfig = (type: string, updates: Partial<ComponentConfig>) => {
  if (componentConfigs[type]) {
    componentConfigs[type] = { ...componentConfigs[type], ...updates }
  }
}

// 移除组件类型
export const removeComponent = (type: string) => {
  if (componentConfigs[type] && type !== 'input') {
    delete componentConfigs[type]
  }
}

// 重置为默认配置
export const resetToDefault = () => {
  componentConfigs = { ...defaultConfigs }
}

// 获取所有组件配置（用于调试）
export const getAllComponentConfigs = () => {
  return { ...componentConfigs }
} 