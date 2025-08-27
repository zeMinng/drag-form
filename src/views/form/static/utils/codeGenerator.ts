import { getComponentConfig } from './componentRegistry'
import type { CenterItem, FormConfig } from '@/store/modules/form'

// 缓存机制
const codeCache = new Map<string, string>()

// 生成缓存键
const generateCacheKey = (items: CenterItem[], formConfig: FormConfig): string => {
  return JSON.stringify({
    items: items.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      vmodel: item.vmodel,
      props: item.props
    })),
    formConfig
  })
}

// 生成Vue模板代码
export const generateVueTemplate = (items: CenterItem[], formConfig: FormConfig): string => {
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
        if (typeof value === 'number') {
          return `:${key}="${value}"`
        }
        return `${key}="${value}"`
      })
      .filter(Boolean)
      .join(' ')

    // 为特殊组件添加额外属性
    let additionalProps = ''
    if (item.type === 'password') {
      additionalProps = 'type="password"'
    } else if (item.type === 'textarea') {
      additionalProps = 'type="textarea"'
    }

    // 生成v-model
    const vmodelStr = `v-model="${formConfig.modelName}.${vmodel}"`
    
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
            if (typeof value === 'number') {
              return `:${key}="${value}"`
            }
            return `${key}="${value}"`
          })
          .filter(Boolean)
          .join(' ')

        // 对于布局组件，我们需要找到它的子组件
        // 这里我们假设布局组件后面紧跟着的组件就是它的子组件
        // 在实际应用中，可能需要更复杂的逻辑来判断组件的父子关系
        
        // 为布局组件添加适当的样式类
        let layoutClass = ''
        if (item.type === 'row') {
          layoutClass = ' class="form-row"'
        } else if (item.type === 'col') {
          layoutClass = ' class="form-col"'
        } else if (item.type === 'card') {
          layoutClass = ' class="form-card"'
        } else if (item.type === 'group') {
          layoutClass = ' class="form-group"'
        }
        
        const attributes = [propsStr, layoutClass].filter(Boolean).join(' ')
        
        // 生成布局组件的开始标签
        let layoutStart = `<${tag}${attributes}>`
        
        // 为不同类型的布局组件添加标题或描述
        if (item.type === 'card' && item.title) {
          layoutStart += `\n    <template #header>\n      <span>${item.title}</span>\n    </template>`
        } else if (item.type === 'group' && item.title) {
          layoutStart += `\n    <div class="group-title">${item.title}</div>`
        }
        
        // 布局组件的内容占位符
        const layoutContent = `\n    <!-- ${item.title || '布局组件'} 内容 -->\n    <!-- 子组件将在这里渲染 -->`
        
        // 生成布局组件的结束标签
        const layoutEnd = `\n  </${tag}>`
        
        return `${layoutStart}${layoutContent}${layoutEnd}`
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
export const generateVueComponent = (items: CenterItem[], formConfig: FormConfig): string => {
  // 检查缓存
  const cacheKey = generateCacheKey(items, formConfig)
  if (codeCache.has(cacheKey)) {
    return codeCache.get(cacheKey)!
  }

  const template = generateVueTemplate(items, formConfig)
  const script = generateVueScript(items, formConfig)
  
  // 根据表单配置生成表单属性
  const formProps = []
  
  // 表单尺寸
  if (formConfig.size && formConfig.size !== 'default') {
    formProps.push(`      size="${formConfig.size}"`)
  }

  // 标签宽度
  if (formConfig.labelWidth) {
    if (typeof formConfig.labelWidth === 'number') {
      formProps.push(`      :label-width="${formConfig.labelWidth}"`)
    } else {
      formProps.push(`      label-width="${formConfig.labelWidth}"`)
    }
  }
  
  // 禁用表单
  if (formConfig.disabled) {
    formProps.push(`      :disabled="true"`)
  }
  
  // 布局方式转换：Ant Design -> Element Plus
  if (formConfig.layout) {
    if (formConfig.layout === 'inline') {
      // Element Plus 行内表单需要设置 :inline="true"
      formProps.push(`      :inline="true"`)
    } else if (formConfig.layout === 'horizontal') {
      // Element Plus 水平布局：标签和输入框在同一行，不需要设置 label-position
      // 默认就是水平布局
    } else if (formConfig.layout === 'vertical') {
      // Element Plus 垂直布局需要设置 label-position="top"
      formProps.push(`      label-position="top"`)
    }
  }
  
  // 标签对齐方式转换：Ant Design -> Element Plus
  // 注意：只有在布局方式不是 horizontal 或 vertical 时才设置 labelAlign
  // 因为 horizontal 和 vertical 已经通过 layout 设置了 label-position
  if (formConfig.labelAlign && formConfig.layout === 'inline') {
    if (formConfig.labelAlign === 'left') {
      formProps.push(`      label-position="left"`)
    } else if (formConfig.labelAlign === 'right') {
      // right 是默认值，不需要特殊设置
    }
  }
  
  // 验证信息显示控制
  if (formConfig.showValidation === false) {
    formProps.push(`      :show-message="false"`)
  }
  
  const formPropsStr = formProps.join('\n')
  
  const fullCode = `<template>
  <div class="form-container">
    <el-form
      ref="formRef"
      :model="${formConfig.modelName}"
      :rules="formRules"
      @submit.prevent="onSubmit"
${formPropsStr}
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

/* 行内表单样式 */
.el-form--inline .el-form-item {
  margin-right: 20px;
  margin-bottom: 20px;
}

/* 水平布局样式 */
.el-form--label-position-top .el-form-item__label {
  padding-bottom: 8px;
}

/* 布局组件样式 */
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-col {
  flex: 1;
}

.form-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #fafafa;
}

.group-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
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