/**
 * Antd -> Element Plus (Vue) 属性映射器
 * 仅用于代码生成阶段，将编辑端(React/Antd)的属性映射为 Vue/Element Plus 支持的属性
 */

type ComponentType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'slider'
  | 'switch'
  | 'row'
  | 'col'
  | 'card'
  | 'group'

const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 针对不同组件类型的属性映射
 */
const mapByType = (type: ComponentType, props: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}

  // 通用映射
  Object.entries(props || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    // 通用大小写/别名
    if (key === 'maxLength') {
      result['maxlength'] = value
      return
    }
    if (key === 'autoComplete') {
      result['autocomplete'] = value
      return
    }

    // 处理对象类型属性（如 responsive）
    if (typeof value === 'object' && !Array.isArray(value)) {
      // 将对象转换为 Vue 模板中可用的格式
      result[key] = value
    } else {
      // 默认直接透传（后续再统一转 kebab）
      result[key] = value
    }
  })

  // 组件特定映射
  switch (type) {
    case 'row': {
      // Antd Row: gutter/justify/align 映射到 el-row
      // gutter: number -> :gutter
      // justify: 'start'|'center'|'end'|'space-between'|'space-around'|'space-evenly' -> 同名
      // align: 'top'|'middle'|'bottom' -> 'top'|'middle'|'bottom'
      break
    }
    case 'col': {
      // Antd Col: span/offset/push/pull/order 映射到 el-col
      // 无 span 时不输出，让渲染端默认 24；生成端若无 span 则默认 24 保证一致
      break
    }
    case 'select': {
      // Antd: showSearch -> Element Plus: filterable
      if ('showSearch' in result) {
        result['filterable'] = !!result['showSearch']
        delete result['showSearch']
      }
      // Antd: mode: 'multiple' | 'tags' -> Element Plus
      if (result.mode === 'multiple') {
        result.multiple = true
        delete result.mode
      } else if (result.mode === 'tags') {
        result.multiple = true
        result['allow-create'] = true
        result['filterable'] = true
        delete result.mode
      } else if ('mode' in result) {
        delete result.mode
      }
      break
    }
    case 'textarea': {
      // rows 保持；maxlength 已在通用层处理
      break
    }
    case 'password': {
      // 生成器中已通过 getSpecialProps 注入 type="password"
      break
    }
    case 'date': {
      // format/placeholder/disabled 保持
      // 可扩展 showTime -> type="datetime"
      if (result.showTime === true) {
        result.type = 'datetime'
        delete result.showTime
      } else if ('showTime' in result) {
        delete result.showTime
      }
      break
    }
    case 'slider': {
      // 我们的配置里 marks 为 boolean，Element Plus 可用 show-stops
      if (typeof result.marks === 'boolean') {
        if (result.marks) result['show-stops'] = true
        delete result.marks
      }
      break
    }
    case 'switch': {
      // React 端的 checked 只是预览用途，Vue 端由 v-model 控制，剔除
      if ('checked' in result) delete result.checked
      break
    }
    default:
      break
  }

  // 最后统一将 key 转为 kebab-case，确保符合 Vue 属性规范
  const kebabResult: Record<string, any> = {}
  Object.entries(result).forEach(([key, value]) => {
    kebabResult[camelToKebab(key)] = value
  })

  return kebabResult
}

export const mapPropsToVue = (type: string, props: Record<string, any>): Record<string, any> => {
  return mapByType(type as ComponentType, props || {})
}
