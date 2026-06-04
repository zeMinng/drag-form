/**
 * 组件类型 -> Ant Design JSX 标签与 import 映射
 */

export const ANTD_IMPORTS_BY_TYPE: Record<string, string[]> = {
  input: ['Input'],
  password: ['Input'],
  textarea: ['Input'],
  number: ['InputNumber'],
  select: ['Select'],
  cascader: ['Cascader'],
  radio: ['Radio'],
  checkbox: ['Checkbox'],
  date: ['DatePicker'],
  slider: ['Slider'],
  switch: ['Switch'],
  row: ['Row'],
  col: ['Col'],
  card: ['Card'],
}

export const JSX_TAG_BY_TYPE: Record<string, string> = {
  input: 'Input',
  password: 'Input.Password',
  textarea: 'Input.TextArea',
  number: 'InputNumber',
  select: 'Select',
  cascader: 'Cascader',
  radio: 'Radio.Group',
  checkbox: 'Checkbox.Group',
  date: 'DatePicker',
  slider: 'Slider',
  switch: 'Switch',
  row: 'Row',
  col: 'Col',
  card: 'Card',
}

export const collectAntdImports = (items: { type: string; children?: { type: string; children?: unknown[] }[] }[]): Set<string> => {
  const imports = new Set<string>(['Form', 'Button'])

  const walk = (nodes: typeof items) => {
    nodes.forEach((item) => {
      const list = ANTD_IMPORTS_BY_TYPE[item.type]
      if (list) list.forEach((name) => imports.add(name))
      if (Array.isArray(item.children)) walk(item.children as typeof items)
    })
  }

  walk(items)
  return imports
}
