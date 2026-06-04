/**
 * React + Ant Design JSX 生成器
 */

import { getComponentConfig } from '../../registry'
import type { CenterItem, FormConfig } from '@/store/modules/form'
import { buildReactPropsString, filterAntdProps } from './propsBuilder'
import { buildAntdRulesString } from './rules'
import { JSX_TAG_BY_TYPE } from './antdMeta'

const pad = (level: number) => '  '.repeat(level)

export const getReactFieldName = (item: CenterItem): string =>
  item.vmodel ?? `${item.type}_${item.id}`

const isOptionsVariable = (options: unknown): options is string =>
  typeof options === 'string' && /^[a-zA-Z_][\w]*$/.test(options.trim())

const parseOptionsList = (optionsText: unknown): { label: string; value: string }[] => {
  const text = typeof optionsText === 'string' && optionsText.trim()
    ? optionsText
    : '选项1,选项2,选项3'
  return text.split(',').map((option, index) => ({
    label: option.trim(),
    value: `option${index + 1}`,
  }))
}

const generateRadioCheckboxChildren = (
  type: 'radio' | 'checkbox',
  optionsText: unknown,
  level: number
): string => {
  const Tag = type === 'radio' ? 'Radio' : 'Checkbox'
  const options = parseOptionsList(optionsText)
  const indent = pad(level + 2)
  return options
    .map(
      (opt) =>
        `${indent}<${Tag} key="${opt.value}" value="${opt.value}">${opt.label}</${Tag}>`
    )
    .join('\n')
}

const generateSelectElement = (
  item: CenterItem,
  props: Record<string, unknown>,
  level: number
): string => {
  const indent = pad(level + 1)
  const baseProps = buildReactPropsString(props)
  const optionsVal = item.props?.options

  if (isOptionsVariable(optionsVal)) {
    const optionsProp = `options={${optionsVal.trim()}}`
    const attrs = [baseProps, optionsProp].filter(Boolean).join(' ')
    return `${indent}<Select ${attrs} />`
  }

  const staticOptions = parseOptionsList(optionsVal)
  const optionsAttr = `options={${JSON.stringify(staticOptions)}}`
  const attrs = [baseProps, optionsAttr].filter(Boolean).join(' ')
  return `${indent}<Select ${attrs} />`
}

const generateControlElement = (item: CenterItem, level: number): string => {
  const tag = JSX_TAG_BY_TYPE[item.type]
  if (!tag) return `${pad(level + 1)}{/* 未知组件: ${item.type} */}`

  const config = getComponentConfig(item.type)
  const merged = filterAntdProps({
    ...(config?.props || {}),
    ...(item.props || {}),
  })

  if (item.type === 'col' && (merged.span === undefined || merged.span === null)) {
    merged.span = 24
  }

  if (item.type === 'card') {
    const title = (item.props?.title as string) || item.title
    if (title) merged.title = title
  }

  const indent = pad(level + 1)

  if (item.type === 'select') {
    return generateSelectElement(item, merged, level)
  }

  if (item.type === 'cascader' && isOptionsVariable(item.props?.options)) {
    const baseProps = buildReactPropsString(merged)
    const optionsProp = `options={${String(item.props?.options).trim()}}`
    const attrs = [baseProps, optionsProp].filter(Boolean).join(' ')
    return `${indent}<Cascader ${attrs} />`
  }

  if (item.type === 'radio' || item.type === 'checkbox') {
    const baseProps = buildReactPropsString(merged)
    const children = generateRadioCheckboxChildren(
      item.type,
      item.props?.options,
      level
    )
    const attrs = baseProps ? ` ${baseProps}` : ''
    return `${indent}<${tag}${attrs}>\n${children}\n${indent}</${tag}>`
  }

  const attrs = buildReactPropsString(merged)
  return attrs
    ? `${indent}<${tag} ${attrs} />`
    : `${indent}<${tag} />`
}

const generateFormItem = (item: CenterItem, formConfig: FormConfig, level: number): string => {
  const fieldName = getReactFieldName(item)
  const rules = buildAntdRulesString(item)
  const indent = pad(level)
  const inner = generateControlElement(item, level)

  const formItemProps: string[] = [
    `label="${(item.title || '').replace(/"/g, '\\"')}"`,
    `name="${fieldName}"`,
  ]
  if (rules) formItemProps.push(rules)
  if (item.type === 'switch') formItemProps.push('valuePropName="checked"')
  if (formConfig.disabled) formItemProps.push('disabled')

  return `${indent}<Form.Item ${formItemProps.join(' ')}>\n${inner}\n${indent}</Form.Item>`
}

const generateLayoutBlock = (item: CenterItem, formConfig: FormConfig, level: number): string => {
  const tag = JSX_TAG_BY_TYPE[item.type] || 'div'
  const config = getComponentConfig(item.type)
  const merged = filterAntdProps({
    ...(config?.props || {}),
    ...(item.props || {}),
  })

  if (item.type === 'col' && (merged.span === undefined || merged.span === null)) {
    merged.span = 24
  }
  if (item.type === 'card') {
    const title = (item.props?.title as string) || item.title
    if (title) merged.title = title
  }

  const attrs = buildReactPropsString(merged)
  const openTag = attrs ? `<${tag} ${attrs}>` : `<${tag}>`
  const indent = pad(level)
  const children = Array.isArray(item.children) ? item.children : []

  if (children.length === 0) {
    return `${indent}${openTag}\n${pad(level + 1)}{/* ${item.title || '布局组件'}（空） */}\n${indent}</${tag}>`
  }

  const childCode = processReactJsx(children, formConfig, level + 1)
  return `${indent}${openTag}\n${childCode}\n${indent}</${tag}>`
}

export const processReactJsx = (
  items: CenterItem[],
  formConfig: FormConfig,
  level = 2
): string => {
  if (items.length === 0) {
    return `${pad(level)}{/* 暂无组件 */}`
  }

  return items
    .map((item) => {
      const config = getComponentConfig(item.type)
      if (!config) {
        return `${pad(level)}{/* 未知组件: ${item.type} */}`
      }
      if (config.category === 'layout') {
        return generateLayoutBlock(item, formConfig, level)
      }
      return generateFormItem(item, formConfig, level)
    })
    .join('\n')
}

export const generateReactJsx = (items: CenterItem[], formConfig: FormConfig): string => {
  return processReactJsx(items, formConfig, 4)
}
