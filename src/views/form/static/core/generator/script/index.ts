/**
 * Vue脚本生成器
 * 负责生成Vue组件的script部分
 */

import { getComponentConfig } from '../../registry/componentRegistry'
import type { CenterItem, FormConfig } from '@/store/modules/form'
import { getTypeScriptTypeByComponentType, getDefaultValueByType } from '../../../utils/types'

/**
 * 生成TypeScript接口定义
 * @param items 组件项数组
 * @returns TypeScript接口字符串
 */
export const generateTypeScriptInterfaces = (items: CenterItem[]): string => {
  const formFields: string[] = []

  const collectFields = (nodes: CenterItem[]) => {
    nodes.forEach((item) => {
      const config = getComponentConfig(item.type)
      if (!config) return

      // 布局型递归其子节点；非布局型收集字段
      if ((config as any).category === 'layout') {
        if (Array.isArray((item as any).children)) collectFields((item as any).children as CenterItem[])
        return
      }

      const vmodel = item.vmodel || config.vmodel || 'value'
      const type = getTypeScriptTypeByComponentType(item.type)
      formFields.push(`  ${vmodel}: ${type}`)
    })
  }

  collectFields(items)

  if (formFields.length === 0) {
    return `interface FormData {
  // 暂无字段
}`
  }

  return `interface FormData {
${formFields.join('\n')}
}`
}

/**
 * 生成Vue 3 Composition API script代码
 * @param items 组件项数组
 * @param formConfig 表单配置
 * @returns Vue脚本字符串
 */
export const generateVueScript = (items: CenterItem[], formConfig: FormConfig): string => {
  if (items.length === 0) {
    return `import { reactive } from 'vue'

const ${formConfig.modelName} = reactive({})

const onSubmit = () => {
  console.log('表单数据:', ${formConfig.modelName})
}

const onReset = () => {
  Object.keys(${formConfig.modelName}).forEach(key => {
    ${formConfig.modelName}[key] = getDefaultValueByType('input')
  })
}`
  }

  const formFields: string[] = []
  const formRules: string[] = []

  const collectNodes = (nodes: CenterItem[]) => {
    nodes.forEach((item) => {
      const config = getComponentConfig(item.type)
      if (!config) return

      if ((config as any).category === 'layout') {
        if (Array.isArray((item as any).children)) collectNodes((item as any).children as CenterItem[])
        return
      }

      const vmodel = item.vmodel || config.vmodel || 'value'
      const defaultValue = getDefaultValueByType(item.type)
      formFields.push(`  ${vmodel}: ${defaultValue},`)

      if (item.props?.required) {
        formRules.push(`  ${vmodel}: [
    { required: true, message: '请输入${item.title || vmodel}', trigger: 'blur' }
  ]`)
      }
    })
  }

  collectNodes(items)

  const formDataStr = formFields.length > 0 ? formFields.join('\n') : '  // 暂无字段'
  const formRulesStr = formRules.length > 0 ? formRules.join(',\n') : '  // 暂无验证规则'

  return `import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()

const ${formConfig.modelName} = reactive({
${formDataStr}
})

const formRules: FormRules = {
${formRulesStr}
}

const onSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    console.log('表单数据:', ${formConfig.modelName})
    // 这里可以发送到服务器
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const onReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}`
}
