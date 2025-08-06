import { getComponentConfig } from './componentRegistry'
import type { CenterItem } from '@/store/modules/form'

// 生成Vue模板代码
export const generateVueTemplate = (items: CenterItem[]): string => {
  if (items.length === 0) {
    return '<div>暂无组件</div>'
  }

  const generateItemCode = (item: CenterItem): string => {
    const config = getComponentConfig(item.type)
    if (!config) {
      return `<!-- 未知组件: ${item.type} -->`
    }

    const tag = config.tag || 'div'
    const vmodel = item.vmodel || config.vmodel || 'value'
    const props = item.props || {}
    
    // 构建属性字符串
    const propsStr = Object.entries(props)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? key : ''
        }
        if (typeof value === 'string') {
          return `${key}="${value}"`
        }
        return `${key}="${value}"`
      })
      .filter(Boolean)
      .join(' ')

    // 为特殊组件添加额外属性
    let additionalProps = ''
    if (item.type === 'password') {
      additionalProps = ' type="password"'
    } else if (item.type === 'textarea') {
      additionalProps = ' type="textarea"'
    }

    // 生成v-model
    const vmodelStr = `v-model="form.${vmodel}"`
    
    // 构建完整的标签
    const attributes = [vmodelStr, propsStr, additionalProps].filter(Boolean).join(' ')
    
    return `<${tag} ${attributes}></${tag}>`
  }

  // 递归处理布局组件
  const processLayoutItems = (items: CenterItem[]): string => {
    return items.map(item => {
      const config = getComponentConfig(item.type)
      if (!config) return generateItemCode(item)

      // 如果是布局组件，需要处理子组件
      if (config.category === 'layout') {
        const tag = config.tag || 'div'
        const props = item.props || {}
        
        const propsStr = Object.entries(props)
          .filter(([key, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => {
            if (typeof value === 'boolean') {
              return value ? key : ''
            }
            if (typeof value === 'string') {
              return `${key}="${value}"`
            }
            return `${key}="${value}"`
          })
          .filter(Boolean)
          .join(' ')

        return `<${tag} ${propsStr}>\n  <!-- 布局组件内容 -->\n</${tag}>`
      }

      return generateItemCode(item)
    }).join('\n')
  }

  return processLayoutItems(items)
}

// 生成TypeScript接口定义
export const generateTypeScriptInterfaces = (items: CenterItem[]): string => {
  const formFields: string[] = []
  
  items.forEach(item => {
    const config = getComponentConfig(item.type)
    if (!config) return

    const vmodel = item.vmodel || config.vmodel || 'value'
    const type = getTypeScriptTypeByComponentType(item.type)
    
    formFields.push(`  ${vmodel}: ${type}`)
  })

  if (formFields.length === 0) {
    return `interface FormData {
  // 暂无字段
}`
  }

  return `interface FormData {
${formFields.join('\n')}
}`
}

// 根据组件类型获取TypeScript类型
const getTypeScriptTypeByComponentType = (type: string): string => {
  switch (type) {
    case 'input':
    case 'password':
    case 'textarea':
    case 'select':
    case 'radio':
    case 'date':
      return 'string'
    case 'number':
    case 'slider':
      return 'number'
    case 'checkbox':
      return 'string[]'
    case 'switch':
      return 'boolean'
    default:
      return 'string'
  }
}

// 生成Vue 3 Composition API script代码
export const generateVueScript = (items: CenterItem[]): string => {
  const formFields: string[] = []
  const formDefaults: string[] = []
  
  items.forEach(item => {
    const config = getComponentConfig(item.type)
    if (!config) return

    const vmodel = item.vmodel || config.vmodel || 'value'
    const defaultValue = getDefaultValueByType(item.type)
    
    formFields.push(`  ${vmodel}: ${defaultValue}`)
    formDefaults.push(`  ${vmodel}: ${defaultValue}`)
  })

  const formData = formFields.length > 0 ? formFields.join(',\n') : '  // 暂无字段'
  const formDefaultsData = formDefaults.length > 0 ? formDefaults.join(',\n') : '  // 暂无字段'

  return `import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

${generateTypeScriptInterfaces(items)}

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive<FormData>({
${formData}
})

// 表单验证规则
const formRules: FormRules = {
  // 在这里添加表单验证规则
}

// 表单提交
const onSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    console.log('表单数据:', form)
    // 在这里处理表单提交逻辑
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 表单重置
const onReset = () => {
  if (!formRef.value) return
  
  formRef.value.resetFields()
  Object.assign(form, {
${formDefaultsData}
  })
}`
}

// 根据组件类型获取默认值
const getDefaultValueByType = (type: string): string => {
  switch (type) {
    case 'input':
    case 'password':
    case 'textarea':
      return "''"
    case 'number':
      return '0'
    case 'select':
    case 'radio':
      return "''"
    case 'checkbox':
      return '[]'
    case 'switch':
      return 'false'
    case 'slider':
      return '0'
    case 'date':
      return "''"
    default:
      return "''"
  }
}

// 生成完整的Vue 3 + TypeScript + Element Plus组件代码
export const generateVueComponent = (items: CenterItem[]): string => {
  const template = generateVueTemplate(items)
  const script = generateVueScript(items)

  return `<template>
  <div class="form-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="120px"
      @submit.prevent="onSubmit"
    >
${template.split('\n').map(line => `      ${line}`).join('\n')}
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
${script}
</script>

<style scoped>
.form-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>`
} 