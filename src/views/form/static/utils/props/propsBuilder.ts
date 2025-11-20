import type { PropConfig } from '@/views/form/static/type/component'

/**
 * 属性构建工具
 * 用于处理组件属性的构建和格式化
 */

export interface PropValue {
  key: string
  value: any
}

/**
 * 构建属性字符串
 * @param props 属性对象
 * @returns 格式化后的属性字符串
 */
export const buildPropsString = (props: Record<string, any>, config?: Record<string, PropConfig>): string => {
  if (!props || Object.keys(props).length === 0) {
    return ''
  }

  return Object.entries(props)
    .filter(([_key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => formatProp(key, value, config))
    .filter(Boolean)
    .join(' ')
}

/**
 * 格式化单个属性
 * @param key 属性名
 * @param value 属性值
 * @returns 格式化后的属性字符串
 */
export const formatProp = (key: string, value: any, config?: Record<string, PropConfig>): string => {
  if (typeof value === 'boolean') {
    return value ? key : ''
  }
  if (typeof value === 'string') {
    if (config && config[key] && config[key].isParam) {
      return `:${key}="${value}"`
    }
    return `${key}="${value}"`
  }
  if (typeof value === 'number') {
    return `:${key}="${value}"`
  }
  if (typeof value === 'object' && value !== null) {
    // 处理对象类型属性，如 responsive
    if (key === 'responsive') {
      // 将响应式对象转换为 Vue 模板格式
      const responsiveProps = Object.entries(value)
        .filter(([_, val]) => val !== undefined && val !== null && val !== '')
        .map(([breakpoint, val]) => `:${breakpoint}="${val}"`)
        .join(' ')
      return responsiveProps
    }
    // 其他对象类型使用 JSON 格式
    return `:${key}='${JSON.stringify(value)}'`
  }
  return `${key}="${value}"`
}

/**
 * 合并多个属性字符串
 * @param propStrings 属性字符串数组
 * @returns 合并后的属性字符串
 */
export const mergeProps = (...propStrings: string[]): string => {
  return propStrings.filter(Boolean).join(' ')
}

/**
 * 为特殊组件添加额外属性
 * @param type 组件类型
 * @returns 额外属性字符串
 */
export const getSpecialProps = (type: string): string => {
  const specialPropsMap: Record<string, string> = {
    password: 'type="password"',
    textarea: 'type="textarea"'
  }
  
  return specialPropsMap[type] || ''
}

/**
 * 构建布局组件的样式类
 * @param type 布局组件类型
 * @returns 样式类字符串
 */
export const getLayoutClass = (type: string): string => {
  const layoutClassMap: Record<string, string> = {
    row: 'class="form-row"',
    col: 'class="form-col"',
    card: 'class="form-card"',
    group: 'class="form-group"'
  }
  
  return layoutClassMap[type] || ''
}
