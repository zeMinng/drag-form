/**
 * 将编辑器校验配置转为 Ant Design Form.Item rules 源码片段
 */

import type { CenterItem } from '@/store/modules/form'
import type { ValidationRule } from '@/pages/form/static/types/component'

const escapeMessage = (msg: string) => msg.replace(/'/g, '\\\'')

const formatSingleRule = (rule: ValidationRule, item: CenterItem): string => {
  const message = escapeMessage(rule.message)
  const trigger = rule.trigger ? `, trigger: '${rule.trigger}'` : ''

  switch (rule.type) {
    case 'required':
      return `{ required: true, message: '${message}'${trigger} }`
    case 'minLength':
      return `{ min: ${rule.value}, type: 'string', message: '${message.replace('{value}', String(rule.value))}'${trigger} }`
    case 'maxLength':
      return `{ max: ${rule.value}, type: 'string', message: '${message.replace('{value}', String(rule.value))}'${trigger} }`
    case 'min':
      if (item.type === 'number' || item.type === 'slider') {
        return `{ type: 'number', min: ${rule.value}, message: '${message.replace('{value}', String(rule.value))}'${trigger} }`
      }
      return `{ min: ${rule.value}, type: 'string', message: '${message.replace('{value}', String(rule.value))}'${trigger} }`
    case 'max':
      if (item.type === 'number' || item.type === 'slider') {
        return `{ type: 'number', max: ${rule.value}, message: '${message.replace('{value}', String(rule.value))}'${trigger} }`
      }
      return `{ max: ${rule.value}, type: 'string', message: '${message.replace('{value}', String(rule.value))}'${trigger} }`
    case 'email':
      return `{ type: 'email', message: '${message}'${trigger} }`
    case 'phone':
      return `{ pattern: /^1[3-9]\\\\d{9}$/, message: '${message}'${trigger} }`
    case 'pattern':
      return `{ pattern: ${rule.value}, message: '${message}'${trigger} }`
    case 'custom':
      return `{ validator: async () => Promise.resolve(), message: '${message}'${trigger} }`
    default:
      return `{ required: true, message: '${message}'${trigger} }`
  }
}

export const buildAntdRulesString = (item: CenterItem): string | null => {
  const rules: string[] = []

  if (item.validation?.rules?.length) {
    item.validation.rules.forEach((rule) => {
      rules.push(formatSingleRule(rule, item))
    })
  } else if (item.props?.required) {
    rules.push(`{ required: true, message: '请输入${escapeMessage(item.title || '')}' }`)
  }

  if (rules.length === 0) return null
  return `rules={[${rules.join(', ')}]}`
}
