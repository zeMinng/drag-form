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
    const propsStr = buildPropsString(props, config.propsConfig)
    
    // 为特殊组件添加额外属性
    const additionalProps = getSpecialProps(item.type)

    // 生成v-model
    const vmodelStr = `v-model="${formConfig.modelName}.${vmodel}"`
    
    // 构建完整的标签
    const attributes = mergeProps(vmodelStr, propsStr, additionalProps)
    
    // 处理选择型组件的选项
    const generateSelectOptions = (type: string, props: Record<string, any>): string => {
      if (type === 'select') {
        // 如果options有值，生成动态遍历代码
        if (props.options && props.options.trim()) {
          return `    <el-option
      v-for="item in ${props.options}"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />`
        } else {
          // 否则生成静态选项
          const optionsText = '选项1,选项2'
          const options = optionsText.split(',').map((opt: string) => opt.trim()).filter(Boolean)
          
          return options.map((option: string, index: number) => 
            `    <el-option key="${index}" label="${option}" value="${option}"></el-option>`
          ).join('\n')
        }
      } else if (type === 'radio') {
        // 如果options有值，生成动态遍历代码
        if (props.options && props.options.trim()) {
          return `    <el-radio
      v-for="item in ${props.options}"
      :value="item.value"
      :label="item.value"
    >{{ item.label }}</el-radio>`
        } else {
          // 否则生成静态选项
          const optionsText = '选项1,选项2'
          const options = optionsText.split(',').map((opt: string) => opt.trim()).filter(Boolean)
          
          return options.map((option: string, index: number) => 
            `    <el-radio value="${index}" label="${option}">${option}</el-radio>`
          ).join('\n')
        }
      } else if (type === 'checkbox') {
        // 如果options有值，生成动态遍历代码
        if (props.options && props.options.trim()) {
          return `    <el-checkbox
      v-for="item in ${props.options}"
      :value="item.value"
      :label="item.value"
    >{{ item.label }}</el-checkbox>`
        } else {
          // 否则生成静态选项
          const optionsText = '选项1,选项2'
          const options = optionsText.split(',').map((opt: string) => opt.trim()).filter(Boolean)
          
          return options.map((option: string, index: number) => 
            `    <el-checkbox value="${index}" label="${option}">${option}</el-checkbox>`
          ).join('\n')
        }
      }
      return ''
    }

    const optionsContent = generateSelectOptions(item.type, item.props || {})
    
    // 用el-form-item包裹
    if (optionsContent) {
      // 对于选择型组件，需要从属性中移除options
      const finalProps = { ...props }
      delete finalProps.options
      const finalPropsStr = buildPropsString(finalProps)
      const finalAttributes = mergeProps(vmodelStr, finalPropsStr, additionalProps)
      
      return `<el-form-item label="${item.title || ''}" prop="${vmodel}">\n  <${tag} ${finalAttributes}>\n${optionsContent}\n  </${tag}>\n</el-form-item>`
    } else {
      return `<el-form-item label="${item.title || ''}" prop="${vmodel}">\n  <${tag} ${attributes}></${tag}>\n</el-form-item>`
    }
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
        // 与编辑端保持一致：Col 未设置 span -> 24（纵向排列）
        if (item.type === 'col' && (props.span === undefined || props.span === null)) {
          props.span = 24
        }
        // 如果是 card 组件，需要删除 title 属性
        if (item.type === 'card') { delete props.title }
        const propsStr = buildPropsString(props)
        
        // 为布局组件添加适当的样式类
        const layoutClass = getLayoutClass(item.type)
        
        const attributes = mergeProps(propsStr, layoutClass)
        
        // 生成布局组件的开始标签
        let layoutStart = `<${tag} ${attributes}>`
        
        // 为不同类型的布局组件添加标题或描述
        if (item.type === 'card' && item.title) {
          layoutStart += `\n  <template #header>\n    <span>${item?.props?.title || item.title}</span>\n  </template>`
        } else if (item.type === 'group' && item.title) {
          layoutStart += `\n  <div class="group-title">${item.title}</div>`
        }
        
        // 递归渲染子组件内容
        const children = Array.isArray((item as any).children) ? (item as any).children as CenterItem[] : []
        const layoutContent = children.length
          ? `\n${processLayoutItems(children).split('\n').map(line => `  ${line}`).join('\n')}`
          : `\n  <!-- ${item.title || '布局组件'}（空） -->`
        
        // 生成布局组件的结束标签
        const layoutEnd = `\n</${tag}>`
        
        return `${layoutStart}${layoutContent}${layoutEnd}`
      }

      return generateItemCode(item)
    }).join('\n')
  }

  return processLayoutItems(items)
}
