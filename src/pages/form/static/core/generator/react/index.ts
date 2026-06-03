/**
 * React + Ant Design + TypeScript 代码生成器主入口
 */

import type { CenterItem, FormConfig } from '@/store/modules/form'
import { getComponentConfig } from '../../registry/componentRegistry'
import { getDefaultValueByType } from '../../../utils/types'
import { defaultCacheManager } from '../../../utils/cache'
import { collectAntdImports } from './antdMeta'
import { generateReactJsx, getReactFieldName } from './jsx'

export { generateReactJsx, getReactFieldName }

const buildFormAttributes = (formConfig: FormConfig): string[] => {
  const attrs: string[] = [
    'form={form}',
    `layout="${formConfig.layout}"`,
    `labelAlign="${formConfig.labelAlign}"`,
    'onFinish={onFinish}',
  ]

  if (formConfig.size && formConfig.size !== 'default') {
    attrs.push(`size="${formConfig.size}"`)
  }
  if (formConfig.disabled) {
    attrs.push('disabled')
  }
  if (formConfig.colon) {
    attrs.push('colon')
  }
  if (formConfig.labelWidth && formConfig.labelWidth !== 'auto') {
    const flex =
      typeof formConfig.labelWidth === 'number'
        ? `'${formConfig.labelWidth}px'`
        : `'${formConfig.labelWidth}'`
    attrs.push(`labelCol={{ flex: ${flex} }}`)
    attrs.push('wrapperCol={{ flex: 1 }}')
  }

  return attrs
}

const collectInitialValues = (items: CenterItem[]): string[] => {
  const fields: string[] = []

  const walk = (nodes: CenterItem[]) => {
    nodes.forEach((item) => {
      const config = getComponentConfig(item.type)
      if (!config) return
      if (config.category === 'layout') {
        if (Array.isArray(item.children)) walk(item.children)
        return
      }
      const name = getReactFieldName(item)
      fields.push(`    ${name}: ${getDefaultValueByType(item.type)},`)
    })
  }

  walk(items)
  return fields
}

/**
 * 生成完整的 React 表单组件源码（.tsx）
 */
export const generateReactComponent = (
  items: CenterItem[],
  formConfig: FormConfig
): string => {
  const cacheKey = defaultCacheManager.generateCacheKey(items, formConfig, 'react')
  if (defaultCacheManager.has(cacheKey)) {
    return defaultCacheManager.get(cacheKey)!
  }

  const antdImports = [...collectAntdImports(items)].sort()
  const importLine = `import { ${antdImports.join(', ')} } from 'antd'`

  const initialValueLines = collectInitialValues(items)
  const initialValuesBlock =
    initialValueLines.length > 0
      ? `initialValues={{\n${initialValueLines.join('\n')}\n    }}`
      : ''

  const formAttrs = [...buildFormAttributes(formConfig)]
  if (initialValuesBlock) formAttrs.push(initialValuesBlock)

  const jsxBody = generateReactJsx(items, formConfig)
  const formAttrStr = formAttrs.map((a) => `      ${a}`).join('\n')

  const fullCode = `import React from 'react'
${importLine}

const GeneratedForm: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = (values: Record<string, unknown>) => {
    console.log('表单数据:', values)
  }

  const onReset = () => {
    form.resetFields()
  }

  return (
    <div className="form-container">
      <Form
${formAttrStr}
      >
${jsxBody}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button htmlType="button" onClick={onReset} style={{ marginLeft: 8 }}>
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default GeneratedForm
`

  defaultCacheManager.set(cacheKey, fullCode)
  return fullCode
}
