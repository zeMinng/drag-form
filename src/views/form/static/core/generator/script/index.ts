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

      // 处理校验规则
      if (item.validation?.rules && item.validation.rules.length > 0) {
        const rules = item.validation.rules.map(rule => {
          let ruleStr = ''
          switch (rule.type) {
            case 'required':
              ruleStr = `{ required: true, message: '${rule.message}', trigger: '${rule.trigger || 'blur'}' }`
              break
            case 'minLength':
              ruleStr = `{ required: true, min: ${rule.value}, message: '${rule.message.replace('{value}', rule.value)}', trigger: '${rule.trigger || 'blur'}' }`
              break
            case 'maxLength':
              ruleStr = `{ required: true, max: ${rule.value}, message: '${rule.message.replace('{value}', rule.value)}', trigger: '${rule.trigger || 'blur'}' }`
              break
            case 'min':
              // 对于数值类型组件，使用 min 属性
              if (item.type === 'input-number' || item.type === 'slider') {
                ruleStr = `{ required: true, min: ${rule.value}, message: '${rule.message.replace('{value}', rule.value)}', trigger: '${rule.trigger || 'blur'}' }`
              } else {
                // 对于字符串类型组件，转换为 minLength
                ruleStr = `{ required: true, min: ${rule.value}, message: '${rule.message.replace('{value}', rule.value)}', trigger: '${rule.trigger || 'blur'}' }`
              }
              break
            case 'max':
              // 对于数值类型组件，使用 max 属性
              if (item.type === 'input-number' || item.type === 'slider') {
                ruleStr = `{ required: true, max: ${rule.value}, message: '${rule.message.replace('{value}', rule.value)}', trigger: '${rule.trigger || 'blur'}' }`
              } else {
                // 对于字符串类型组件，转换为 maxLength
                ruleStr = `{ required: true, max: ${rule.value}, message: '${rule.message.replace('{value}', rule.value)}', trigger: '${rule.trigger || 'blur'}' }`
              }
              break
            case 'email':
              ruleStr = `{ required: true, type: 'email', message: '${rule.message}', trigger: '${rule.trigger || 'blur'}' }`
              break
            case 'phone':
              ruleStr = `{ required: true, pattern: /^1[3-9]\\d{9}$/, message: '${rule.message}', trigger: '${rule.trigger || 'blur'}' }`
              break
            case 'pattern':
              ruleStr = `{ required: true, pattern: ${rule.value}, message: '${rule.message}', trigger: '${rule.trigger || 'blur'}' }`
              break
            case 'custom':
              ruleStr = `{ required: true, validator: (rule, value, callback) => { /* 自定义校验逻辑 */ callback() }, trigger: '${rule.trigger || 'blur'}' }`
              break
            default:
              ruleStr = `{ required: true, message: '${rule.message}', trigger: '${rule.trigger || 'blur'}' }`
          }
          return ruleStr
        }).join(',\n    ')
        
        if (rules.trim()) {
          formRules.push(`  ${vmodel}: [
    ${rules}
  ]`)
        }
      } else if (item.props?.required) {
        // 兼容旧的 required 属性
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
