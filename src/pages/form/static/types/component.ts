import React from 'react'

// 组件分类
export type ComponentCategory = 'input' | 'select' | 'layout' | 'advanced'

// 支持的属性值类型
export type PropValueType = string | number | boolean | string[] | number[] | Record<string, any> | undefined

// 校验规则类型
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone' | 'custom'
  message: string
  value?: any // 校验值，如最小长度、正则表达式等
  trigger?: 'blur' | 'change' | 'submit'
}

// 校验规则配置
export interface ValidationConfig {
  rules: ValidationRule[]
}

// 组件元信息
export interface ComponentMeta {
  readonly key: string
  title: string
  description?: string
  icon?: string
  category: ComponentCategory
}

// 属性配置类型
export interface PropConfig {
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'slider' | 'radio' | 'checkbox' | 'color' | 'slider-input' | 'responsive-span'
  label: string
  defaultValue?: PropValueType
  placeholder?: string
  options?: Array<{ label: string; value: string | number | undefined }>
  min?: number
  max?: number
  step?: number
  rows?: number
  marks?: boolean
  allowClear?: boolean
  isParam?: boolean // 设置这个参数后，默认react会被detele掉，在vue中会被保留，生成代码也会默认添加上:号
}

// 组件配置
export interface ComponentConfig {
  component: React.ComponentType<any>
  props?: Record<string, any>
  children?: React.ReactNode
  label?: string
  description?: string
  icon?: string
  category: ComponentCategory
  tag?: string // 组件标签，用于代码生成（如 el-input）
  vmodel?: string // 默认的v-model字段名
  propsConfig?: Record<string, PropConfig>
}

// 表单中的组件项
export interface FormComponent {
  id: string
  type: string
  title: string
  description?: string
  icon?: string
  props?: Record<string, PropValueType>
  validation?: ValidationConfig
}

// 组件注册器接口
export interface ComponentRegistry {
  register: (type: string, config: ComponentConfig) => void
  getConfig: (type: string) => ComponentConfig | null
  getMeta: (type: string) => ComponentMeta | null
  getAllMetas: () => ComponentMeta[]
  getMetasByCategory: (category: ComponentCategory) => ComponentMeta[]
  updateConfig: (type: string, updates: Partial<ComponentConfig>) => void
  remove: (type: string) => void
  reset: () => void
}
