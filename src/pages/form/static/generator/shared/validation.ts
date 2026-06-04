/**
 * 校验规则通用工具
 * 提供 Vue / React 校验规则的通用表示与转换基础
 */

import type { ValidationRule } from '@/pages/form/static/types/component'

/**
 * 转义校验消息中的特殊字符
 */
export const escapeMessage = (msg: string): string =>
  msg.replace(/'/g, "\\'")

/**
 * 替换消息模板中的 {value} 占位符
 */
export const resolveMessageTemplate = (message: string, value: any): string =>
  message.replace('{value}', String(value ?? ''))

/**
 * 判断组件是否为数值型（影响校验规则的类型推断）
 */
export const isNumericType = (componentType: string): boolean =>
  ['number', 'slider', 'input-number'].includes(componentType)

/**
 * 获取规则的默认触发时机
 */
export const getDefaultTrigger = (rule: ValidationRule): string =>
  rule.trigger || 'blur'
