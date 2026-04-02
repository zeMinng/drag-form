import type { FormComponent, ValidationConfig } from '@/pages/form/static/type/component'

export interface CenterItem extends FormComponent {
  id: string
  type: string
  title: string
  description?: string
  icon?: string
  vmodel?: string // v-model字段名
  props?: Record<string, any> // 组件属性
  validation?: ValidationConfig // 校验规则
  children?: CenterItem[] // 子组件（用于布局型组件的嵌套）
}

// 表单级别配置
export interface FormConfig {
  size: 'large' | 'default' | 'small'
  modelName: string
  labelWidth: string | number
  disabled: boolean
  layout: 'vertical' | 'horizontal' | 'inline'
  labelAlign: 'left' | 'right'
  showValidation: boolean
  colon?: boolean // 是否显示冒号
}

export interface FormState {
  centerItems: CenterItem[]
  selectedItemId: string | null // 当前选中的组件ID
  formConfig: FormConfig // 表单级别配置
}

export interface FormActions {
  addCenterItem: (item: Omit<CenterItem, 'id'>) => void
  updateCenterItem: (id: string, updates: Partial<CenterItem>) => void
  updateItems: (items: CenterItem[]) => void
  removeCenterItem: (id: string) => void
  setSelectedItemId: (id: string | null) => void
  getSelectedItem: () => CenterItem | null
  updateFormConfig: (config: Partial<FormConfig>) => void
  resetFormConfig: () => void
}

export type FormStore = FormState & FormActions
