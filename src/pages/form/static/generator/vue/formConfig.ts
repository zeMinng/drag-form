/**
 * 表单配置构建工具
 * 用于处理表单配置的构建和转换（Vue/Element Plus）
 */

import type { FormConfig } from '@/store/modules/form'

/**
 * 构建表单属性字符串
 * @param formConfig 表单配置
 * @returns 表单属性字符串数组
 */
export const buildFormProps = (formConfig: FormConfig): string[] => {
  const formProps: string[] = []
  
  // 表单尺寸
  if (formConfig.size && formConfig.size !== 'default') {
    formProps.push(`size="${formConfig.size}"`)
  }

  // 标签宽度
  if (formConfig.labelWidth) {
    if (typeof formConfig.labelWidth === 'number') {
      formProps.push(`:label-width="${formConfig.labelWidth}"`)
    } else {
      formProps.push(`label-width="${formConfig.labelWidth}"`)
    }
  }
  
  // 禁用表单
  if (formConfig.disabled) {
    formProps.push(`:disabled="true"`)
  }

  // 是否加入冒号
  if (formConfig.colon) {
    formProps.push(`label-suffix=":"`)
  }
  
  // 布局方式转换：Ant Design -> Element Plus
  const layoutProps = buildLayoutProps(formConfig)
  formProps.push(...layoutProps)
  
  // 标签对齐方式
  const labelAlignProps = buildLabelAlignProps(formConfig)
  formProps.push(...labelAlignProps)
  
  // 验证信息显示控制
  if (formConfig.showValidation === false) {
    formProps.push(`:show-message="false"`)
  }

  return formProps
}

/**
 * 构建布局相关属性
 * @param formConfig 表单配置
 * @returns 布局属性字符串数组
 */
const buildLayoutProps = (formConfig: FormConfig): string[] => {
  const props: string[] = []
  
  if (formConfig.layout) {
    if (formConfig.layout === 'inline') {
      // Element Plus 行内表单需要设置 :inline="true"
      props.push(`:inline="true"`)
    } else if (formConfig.layout === 'vertical') {
      // Element Plus 垂直布局需要设置 label-position="top"
      props.push(`label-position="top"`)
    }
    // horizontal 是默认值，不需要特殊设置
  }
  
  return props
}

/**
 * 构建标签对齐方式属性
 * @param formConfig 表单配置
 * @returns 标签对齐属性字符串数组
 */
const buildLabelAlignProps = (formConfig: FormConfig): string[] => {
  const props: string[] = []
  
  // 注意：只有在布局方式不是 horizontal 或 vertical 时才设置 labelAlign
  // 因为 horizontal 和 vertical 已经通过 layout 设置了 label-position
  if (formConfig.labelAlign && formConfig.layout === 'inline') {
    if (formConfig.labelAlign === 'left') {
      props.push(`label-position="left"`)
    }
    // right 是默认值，不需要特殊设置
  }
  
  return props
}

/**
 * 格式化表单属性字符串
 * @param formProps 表单属性数组
 * @returns 格式化后的属性字符串
 */
export const formatFormProps = (formProps: string[]): string => {
  return formProps.join('\n')
}
