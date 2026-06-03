/**
 * 代码生成器主入口
 * 整合模板、脚本、样式生成器，生成完整的Vue组件代码
 */

import type { CenterItem, FormConfig } from '@/store/modules/form'
import { generateVueTemplate } from './template'
import { generateVueScript, generateTypeScriptInterfaces } from './script'
import { generateVueStyle } from './style'
import { buildFormProps, formatFormProps } from '../../utils/props/formConfigBuilder'
import { defaultCacheManager } from '../../utils/cache'

// 重新导出子模块的函数，保持向后兼容
export { generateVueTemplate, generateVueScript, generateTypeScriptInterfaces, generateVueStyle }
export { generateReactComponent, generateReactJsx } from './react'

/**
 * 生成完整的Vue 3 + TypeScript + Element Plus组件代码
 * @param items 组件项数组
 * @param formConfig 表单配置
 * @returns 完整的Vue组件代码
 */
export const generateVueComponent = (items: CenterItem[], formConfig: FormConfig): string => {
  // 检查缓存
  const cacheKey = defaultCacheManager.generateCacheKey(items, formConfig)
  if (defaultCacheManager.has(cacheKey)) {
    return defaultCacheManager.get(cacheKey)!
  }

  const template = generateVueTemplate(items, formConfig)
  const script = generateVueScript(items, formConfig)
  
  // 根据表单配置生成表单属性
  const formProps = buildFormProps(formConfig)
  const formPropsStr = formatFormProps(formProps)
  
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
${generateVueStyle()}
</style>`

  // 缓存结果
  defaultCacheManager.set(cacheKey, fullCode)

  return fullCode
}
