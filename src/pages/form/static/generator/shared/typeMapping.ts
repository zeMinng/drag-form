/**
 * 类型映射工具
 * 用于处理 TypeScript 类型推断和默认值映射
 */

/**
 * 根据组件类型获取TypeScript类型
 * @param type 组件类型
 * @returns TypeScript类型字符串
 */
export const getTypeScriptTypeByComponentType = (type: string): string => {
  const typeMap: Record<string, string> = {
    input: 'string',
    textarea: 'string',
    password: 'string',
    number: 'number',
    slider: 'number',
    switch: 'boolean',
    checkbox: 'boolean',
    radio: 'string',
    select: 'string',
    date: 'string',
    time: 'string'
  }
  
  return typeMap[type] || 'string'
}

/**
 * 根据组件类型获取默认值
 * @param type 组件类型
 * @returns 默认值字符串
 */
export const getDefaultValueByType = (type: string): string => {
  const defaultValueMap: Record<string, string> = {
    input: '\'\'',
    textarea: '\'\'',
    password: '\'\'',
    number: '0',
    slider: '0',
    switch: 'false',
    checkbox: '[]',
    radio: '\'\'',
    select: '\'\'',
    date: '\'\'',
    time: '\'\''
  }
  
  return defaultValueMap[type] || '\'\''
}

/**
 * 获取所有支持的组件类型
 * @returns 组件类型数组
 */
export const getSupportedComponentTypes = (): string[] => {
  return [
    'input',
    'textarea', 
    'password',
    'number',
    'slider',
    'switch',
    'checkbox',
    'radio',
    'select',
    'date',
    'time'
  ]
}

/**
 * 检查是否为数值类型组件
 * @param type 组件类型
 * @returns 是否为数值类型
 */
export const isNumericComponent = (type: string): boolean => {
  return ['number', 'slider'].includes(type)
}

/**
 * 检查是否为布尔类型组件
 * @param type 组件类型
 * @returns 是否为布尔类型
 */
export const isBooleanComponent = (type: string): boolean => {
  return ['switch', 'checkbox'].includes(type)
}

/**
 * 检查是否为文本类型组件
 * @param type 组件类型
 * @returns 是否为文本类型
 */
export const isTextComponent = (type: string): boolean => {
  return ['input', 'textarea', 'password'].includes(type)
}
