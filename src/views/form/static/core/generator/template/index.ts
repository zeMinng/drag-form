/**
 * Vue模板生成器
 * 负责生成Vue组件的template部分
 */

import { getComponentConfig } from '../../registry/componentRegistry'
import type { CenterItem, FormConfig } from '@/store/modules/form'
import { buildPropsString, mergeProps, getSpecialProps, getLayoutClass, mapPropsToVue } from '../../../utils/props'

/**
 * 生成Vue模板代码
 * @param items 组件项数组
 * @param formConfig 表单配置
 * @returns Vue模板字符串
 */
export const generateVueTemplate = (items: CenterItem[], formConfig: FormConfig): string => {
  if (items.length === 0) {
    return '<!-- 暂无组件 -->'
  }

  const generateItemCode = (item: CenterItem): string => {
    const config = getComponentConfig(item.type)
    if (!config) {
      return `<!-- 未知组件: ${item.type} -->`
    }

    const tag = config.tag || 'div'
    const vmodel = item.vmodel || config.vmodel || 'value'
    // 将编辑端(React/Antd)属性映射为 Vue/Element Plus 属性
    const props = mapPropsToVue(item.type as unknown as string, item.props || {})
    
    // 构建属性字符串
    const propsStr = buildPropsString(props)
    
    // 为特殊组件添加额外属性
    const additionalProps = getSpecialProps(item.type)

    // 生成v-model
    const vmodelStr = `v-model="${formConfig.modelName}.${vmodel}"`
    
    // 构建完整的标签
    const attributes = mergeProps(vmodelStr, propsStr, additionalProps)
    
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
        const props = mapPropsToVue(item.type as unknown as string, item.props || {})
        const propsStr = buildPropsString(props)
        
        // 为布局组件添加适当的样式类
        const layoutClass = getLayoutClass(item.type)
        
        const attributes = mergeProps(propsStr, layoutClass)
        
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
