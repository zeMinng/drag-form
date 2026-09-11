import React from 'react'
import { Form, Radio, Checkbox } from 'antd'
import { getComponentConfig } from '../registry'
import type { FormComponent, ComponentConfig } from '@/pages/form/static/types/component'
import type { CenterItem, FormConfig } from '@/store/modules/form'
import { ComponentWrapper } from './componentRenderer'

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

// 检查是否有必填校验规则
const hasRequiredRule = (validation?: { rules: any[] }) => {
  if (!validation || !validation.rules || validation.rules.length === 0) {
    return false
  }
  
  return validation.rules.some(rule => rule.type === 'required')
}

// 统一的渲染方法：根据中心区的 item 和表单配置渲染（带 Form.Item 包裹、禁用态、选项转换等）
export const renderComponentByType = (item: CenterItem, formConfig: FormConfig) => {
  const config = getComponentConfig(item.type)
  if (!config) {
    return React.createElement(ComponentWrapper, { title: item.title }, React.createElement('div', {}, `未知组件类型: ${item.type}`))
  }

  const Component = config.component

  // 提取 isParam:true 的字段
  const params = extractParams(item, config)

  // 合并默认属性和自定义属性
  const mergedProps: Record<string, any> = { ...config.props, ...item.props }
  // 删除掉所有 isParam 字段（它们不应该直接传给组件）
  Object.keys(params).forEach(key => {
    delete mergedProps[key]
  })

  const fieldName = `${item.type}_${item.id}` // || (item as any).vmodel || config.vmodel

  // 过滤掉不兼容的属性，避免 React 警告
  const filterIncompatibleProps = (props: Record<string, any>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clearable, ...rest } = props
    return rest
  }

  // 应用表单级别的禁用状态
  if (formConfig.disabled) {
    mergedProps.disabled = true
  }

  // 处理 radio 和 checkbox 的选项配置
  if (item.type === 'radio' || item.type === 'checkbox') {
    const optionsText = item.props?.options || '选项1,选项2,选项3'
    const optionsArray = optionsText.split(',').map((option: string, index: number) => ({
      label: option.trim(),
      value: `option${index + 1}`
    }))

    // 为 Radio.Group 和 Checkbox.Group 提供正确的选项格式
    const children = optionsArray.map((option: { label: string; value: string }) => {
      if (item.type === 'radio') {
        return React.createElement(Radio, { key: option.value, value: option.value }, option.label)
      }
      return React.createElement(Checkbox, { key: option.value, value: option.value }, option.label)
    })

    const componentProps = {
      ...filterIncompatibleProps(mergedProps),
      options: optionsArray
    }

    // 检查是否有必填规则，用于显示红色星号
    const isRequired = hasRequiredRule(item.validation)

    return React.createElement(
      Form.Item,
      { label: item.title, name: fieldName, required: isRequired },
      React.createElement(Component as any, componentProps, ...children)
    )
  }

  // 布局组件不显示标签
  if (item.type === 'row' || item.type === 'col' || item.type === 'card' || item.type === 'group') {
    return React.createElement(
      Component as any,
      filterIncompatibleProps(mergedProps),
      config.children
    )
  }

  // 检查是否有必填规则，用于显示红色星号
  const isRequired = hasRequiredRule(item.validation)
  // 普通表单组件显示标签
  return React.createElement(
    Form.Item,
    { label: item.title, name: fieldName, required: isRequired },
    React.createElement(Component as any, filterIncompatibleProps(mergedProps), config.children)
  )
}


function extractParams(item: CenterItem, config: ComponentConfig) {
  const props = item.props || {}
  const propsConfig = config.propsConfig || {}

  const result: { [key: string]: any } = {}

  for (const key in propsConfig) {
    const conf = propsConfig[key]
    if (conf.isParam) {
      result[key] = props[key]
    }
  }

  return result
}
