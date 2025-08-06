import { getComponentConfig } from './componentRegistry'
import type { CenterItem } from '@/store/modules/form'

// 缓存机制
const codeCache = new Map<string, string>()

// 生成缓存键
const generateCacheKey = (items: CenterItem[]): string => {
  return JSON.stringify(items.map(item => ({
    id: item.id,
    type: item.type,
    title: item.title,
    vmodel: item.vmodel,
    props: item.props
  })))
}

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
      .filter(([_key, value]) => value !== undefined && value !== null && value !== '')
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
    
    // 用el-form-item包裹
    return `<el-form-item label="${item.title || ''}" prop="${vmodel}">\n  <${tag} ${attributes}></${tag}>\n</el-form-item>`
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
          .filter(([_key, value]) => value !== undefined && value !== null && value !== '')
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


        // const children = item.children ? processLayoutItems(item.children) : ''
        // return `<${tag} ${propsStr}>\n${children}\n</${tag}>`
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
    case 'textarea':
    case 'password':
      return 'string'
    case 'number':
    case 'slider':
      return 'number'
    case 'switch':
    case 'checkbox':
      return 'boolean'
    case 'radio':
      return 'string'
    case 'select':
    case 'date':
    case 'time':
      return 'string'
    default:
      return 'string'
  }
}

// 生成Vue 3 Composition API script代码
export const generateVueScript = (items: CenterItem[]): string => {
  if (items.length === 0) {
    return `import { reactive } from 'vue'

const form = reactive({})

const onSubmit = () => {
  console.log('表单数据:', form)
}

const onReset = () => {
  Object.keys(form).forEach(key => {
    form[key] = getDefaultValueByType('input')
  })
}`
  }

  const formFields: string[] = []
  const formRules: string[] = []
  
  items.forEach(item => {
    const config = getComponentConfig(item.type)
    if (!config) return

    const vmodel = item.vmodel || config.vmodel || 'value'
    const defaultValue = getDefaultValueByType(item.type)
    
    formFields.push(`  ${vmodel}: ${defaultValue},`)
    
    // 生成验证规则
    if (item.props?.required) {
      formRules.push(`  ${vmodel}: [
    { required: true, message: '请输入${item.title || vmodel}', trigger: 'blur' }
  ]`)
    }
  })

  const formDataStr = formFields.length > 0 ? formFields.join('\n') : '  // 暂无字段'
  const formRulesStr = formRules.length > 0 ? formRules.join(',\n') : '  // 暂无验证规则'

  return `import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()

const form = reactive({
${formDataStr}
})

const formRules: FormRules = {
${formRulesStr}
}

const onSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    console.log('表单数据:', form)
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

// 根据组件类型获取默认值
const getDefaultValueByType = (type: string): string => {
  switch (type) {
    case 'input':
    case 'textarea':
    case 'password':
      return "''"
    case 'number':
    case 'slider':
      return '0'
    case 'switch':
    case 'checkbox':
      return 'false'
    case 'radio':
      return "''"
    case 'select':
    case 'date':
    case 'time':
      return "''"
    default:
      return "''"
  }
}

// 生成完整的Vue 3 + TypeScript + Element Plus组件代码
export const generateVueComponent = (items: CenterItem[]): string => {
  // 检查缓存
  const cacheKey = generateCacheKey(items)
  if (codeCache.has(cacheKey)) {
    return codeCache.get(cacheKey)!
  }

  const template = generateVueTemplate(items)
  const script = generateVueScript(items)
  
  const fullCode = `<template>
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

  // 缓存结果
  codeCache.set(cacheKey, fullCode)
  
  // 限制缓存大小，避免内存泄漏
  if (codeCache.size > 100) {
    const firstKey = codeCache.keys().next().value
    if (firstKey) {
      codeCache.delete(firstKey)
    }
  }

  return fullCode
} 