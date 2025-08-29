// 拖拽相关常量
export const DRAG_CONSTANTS = {
  ACTIVATION_DISTANCE: 8,
  COMPONENT_TYPE: 'component',
  CENTER_DROP_AREA_ID: 'center-drop-area',
} as const

// 组件类型常量
export const COMPONENT_TYPES = {
  LAYOUT: ['row', 'col', 'card', 'group'],
  OPTION: ['radio', 'checkbox'],
} as const

// 样式常量
export const STYLES = {
  DRAG_OVERLAY: {
    opacity: 0.8,
    cursor: 'grab',
    background: '#fff',
    border: '1px solid #1890ff',
    boxShadow: '0 2px 8px rgba(24,144,255,0.3)',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  ICON: {
    background: '#f1f5f9',
    borderRadius: 4,
    padding: 4,
    marginRight: 8,
  },
  TITLE: {
    fontWeight: 500,
    marginBottom: 8,
  },
  DESCRIPTION: {
    fontSize: 12,
    color: '#888',
  },
} as const

// 工具函数
export const utils = {
  // 生成唯一ID
  generateId: (prefix = 'item'): string => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  
  // 验证JSON数据格式
  validateJSONData: (data: any): { isValid: boolean; error?: string } => {
    if (!Array.isArray(data)) {
      return { isValid: false, error: 'JSON数据必须是数组格式' }
    }
    
    const isValidData = data.every((item: any) => 
      item && typeof item === 'object' && 
      item.id && item.type && item.title
    )
    
    if (!isValidData) {
      return { isValid: false, error: 'JSON数据格式不正确，每个项目必须包含id、type、title字段' }
    }
    
    return { isValid: true }
  },
  
  // 解析选项配置文本
  parseOptionsText: (optionsText: string) => {
    return optionsText.split(',').map((option: string, index: number) => ({
      label: option.trim(),
      value: `option${index + 1}`
    }))
  },
  
  // 将小写属性名转换为 React 驼峰命名
  convertToReactPropName: (key: string): string => {
    const propNameMap: Record<string, string> = {
      maxlength: 'maxLength',
      autocomplete: 'autoComplete',
      'show-search': 'showSearch',
      'allow-clear': 'allowClear',
      'show-text': 'showText'
    }
    
    return propNameMap[key] || key
  },
  
  // 过滤不兼容的属性
  filterIncompatibleProps: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clearable, ...rest } = props
    
    // 转换属性名，确保 React 使用正确的命名
    const convertedProps: any = {}
    Object.entries(rest).forEach(([key, value]) => {
      // 将小写属性名转换为驼峰命名
      const reactKey = utils.convertToReactPropName(key)
      convertedProps[reactKey] = value
    })
    
    return convertedProps
  },
  
  // 复制文本到剪贴板（带降级方案）
  copyToClipboard: async (text: string, fallbackElement?: HTMLElement): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      // 降级方案：使用传统的复制方法
      if (fallbackElement) {
        try {
          const range = document.createRange()
          range.selectNodeContents(fallbackElement)
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            selection.addRange(range)
            document.execCommand('copy')
            selection.removeAllRanges()
            return true
          }
        } catch (fallbackError) {
          console.warn('复制失败:', fallbackError)
        }
      }
      return false
    }
  }
}
