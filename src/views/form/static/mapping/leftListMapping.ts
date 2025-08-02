/**
 * 输入组件映射
 * @description 该映射用于定义输入组件的类型、标签和图标
 * @author zeMing
 */
export type ComponentCategory = 'input' | 'select' | 'layout'

export interface ComponentMeta {
  key: string
  title: string
  description?: string
  icon?: string
}

export const leftListSegmentedOptions = [
  { label: '输入型', value: 'input' },
  { label: '选择型', value: 'select' },
  { label: '布局型', value: 'layout' },
] satisfies { label: string; value: ComponentCategory }[]

// 输入型组件
export const inputMapping: ComponentMeta[] = [
  { key: 'input', title: '输入框', description: '用于输入文本的基础组件', icon: 'icon-shurukuang' },
  { key: 'number', title: '数字输入框', description: '只允许输入数字的输入框', icon: 'icon-shuzishurukuang' },
  { key: 'password', title: '密码框', description: '用于输入密码的组件', icon: 'icon-mimakuang' },
  { key: 'textarea', title: '文本域', description: '多行文本输入框', icon: 'icon-duohangwenben' },
  { key: 'switch', title: '开关', description: '用于表示开/关状态的小组件', icon: 'icon-kaiguan' },
]

// 选择型组件
export const selectMapping: ComponentMeta[] = [
  { key: 'radio', title: '单选框', description: '从多个选项中选择一个', icon: 'icon-danxuankuang-xuanzhong' },
  { key: 'checkbox', title: '复选框', description: '从多个选项中选择多个', icon: 'icon-checkbox-selected-copy' },
  { key: 'select', title: '下拉选择', description: '经典的下拉菜单组件', icon: 'icon-xialaxuanze' },
  { key: 'cascader', title: '级联选择', description: '用于多级选择的组件', icon: 'icon-jilianxuanze' },
]

// 布局型组件
export const layoutMapping: ComponentMeta[] = [
  { key: 'row', title: '行布局', description: '水平排列组件容器', icon: 'icon-hangbuju' },
  { key: 'col', title: '列布局', description: '在行中纵向排列内容', icon: 'icon-liebuju' },
  { key: 'card', title: '卡片布局', description: '用于包裹内容的卡片容器', icon: 'icon-kapianbuju' },
  { key: 'group', title: '分组布局', description: '将一组组件归类显示', icon: 'icon-a-09-fenzubuju' },
]

// 分类映射
export const componentMappings: Record<ComponentCategory, ComponentMeta[]> = {
  input: inputMapping,
  select: selectMapping,
  layout: layoutMapping,
}
