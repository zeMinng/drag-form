import type { FormConfig } from '../type/form'

/**
 * 表单相关常量定义
 */

// 默认表单配置
export const defaultFormConfig: FormConfig = {
  size: 'default',
  modelName: 'form',
  labelWidth: 'auto',
  disabled: false,
  layout: 'horizontal',
  labelAlign: 'right',
  showValidation: true,
  colon: false,
}
