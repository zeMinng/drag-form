import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Modal, message, Radio, Checkbox, Drawer, Space, Form, Button } from 'antd'
import { CopyOutlined, FormOutlined } from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import IconFont from '@/components/Icon'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import DownloadOutVue from '../downloadOutVue/index'
import { useFormStore, type CenterItem, type FormConfig } from '@/store/modules/form'
import { getComponentConfig, ComponentWrapper, generateVueComponent } from '@/views/form/static'
import { ToolbarConfig } from '../../components/ToolbarConfig'
import { InsertIndicator } from '../../components/InsertIndicator'
import { useClipboard } from '@/hooks/useClipboard'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { COMPONENT_TYPES, utils } from '../../static/utils/commonUtils'
import './index.scss'

const clearTheCanvas = () => {
  Modal.confirm({
    title: '提示',
    content: '确定要清空画布吗？',
    centered: true,
    onOk: () => {
      useFormStore.setState({
        centerItems: [],
        selectedItemId: null,
      })
    },
  })
}

const CenterTop: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [codeModalVisible, setCodeModalVisible] = useState(false)
  const [jsonModalVisible, setJsonModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedJson, setEditedJson] = useState('')
  const { centerItems, updateItems, formConfig } = useFormStore()
  const codeRef = useRef<HTMLPreElement>(null)
  const jsonTextareaRef = useRef<HTMLTextAreaElement>(null)
  const jsonPreRef = useRef<HTMLPreElement>(null)
  
  // 使用剪贴板 hook
  const { copyText } = useClipboard()

  const handleViewCode = useCallback(() => {
    setCodeModalVisible(true)
  }, [])

  const handleCopyCode = useCallback(async () => {
    const generatedCode = generateVueComponent(centerItems, formConfig)
    await copyText(
      generatedCode, 
      codeRef.current || undefined,
      '代码已复制到剪贴板',
      '复制失败，请手动选择复制'
    )
  }, [centerItems, formConfig, copyText])

  const handleViewJSON = useCallback(() => {
    setJsonModalVisible(true)
    setEditedJson(JSON.stringify(centerItems, null, 2))
    setIsEditing(false)
  }, [centerItems])

  // const handleCopyJSON = useCallback(async () => {
  //   try {
  //     const jsonData = isEditing ? editedJson : JSON.stringify(centerItems, null, 2)
  //     await navigator.clipboard.writeText(jsonData)
  //     message.success('JSON数据已复制到剪贴板')
  //   } catch (error) {
  //     // 如果 clipboard API 不可用，使用传统方法
  //     const currentRef = isEditing ? jsonTextareaRef.current : jsonPreRef.current
  //     if (currentRef) {
  //       const range = document.createRange()
  //       range.selectNodeContents(currentRef)
  //       const selection = window.getSelection()
  //       if (selection) {
  //         selection.removeAllRanges()
  //         selection.addRange(range)
  //         document.execCommand('copy')
  //         selection.removeAllRanges()
  //         message.success('JSON数据已复制到剪贴板')
  //       }
  //     }
  //   }
  // }, [centerItems, isEditing, editedJson])

  const handleEditJSON = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleSaveJSON = useCallback(() => {
    try {
      const parsedData = JSON.parse(editedJson)
      const validation = utils.validateJSONData(parsedData)
      
      if (validation.isValid) {
        updateItems(parsedData)
        message.success('JSON数据已成功更新')
        setIsEditing(false)
      } else {
        message.error(validation.error || 'JSON数据验证失败')
      }
    } catch {
      message.error('JSON格式错误，请检查语法')
    }
  }, [editedJson, updateItems])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditedJson(JSON.stringify(centerItems, null, 2))
  }, [centerItems])

  const generatedCode = useMemo(() => generateVueComponent(centerItems, formConfig), [centerItems, formConfig])
  const jsonData = useMemo(() => JSON.stringify(centerItems, null, 2), [centerItems])

  useEffect(() => {
    if (codeModalVisible) {
      Prism.highlightAll()
    }
  }, [codeModalVisible, generatedCode])

  return (
    <div className="centerTop">
      <ToolbarConfig
        onClear={clearTheCanvas}
        onEditJSON={handleViewJSON}
        onExport={() => setModalVisible(true)}
        onPreview={handleViewCode}
      />

      <DownloadOutVue
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <Drawer
        title="预览代码"
        placement="right"
        closable={false}
        size="large"
        onClose={() => setCodeModalVisible(false)}
        open={codeModalVisible}
        extra={
          <Space>
            <Button key="copy" icon={<CopyOutlined />} type="primary" onClick={handleCopyCode}>
              复制代码
            </Button>
            <Button key="close" onClick={() => setCodeModalVisible(false)}>
              关闭
            </Button>
          </Space>
        }
      >
        <div style={{ position: 'relative' }}>
          <pre
            ref={codeRef}
            style={{
              margin: 0,
              background: '#1e1e1e',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '13px',
              lineHeight: '1.5',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              userSelect: 'text',
              cursor: 'text',
              whiteSpace: 'pre-wrap',
            }}
          >
            <code className="language-markup">{generatedCode}</code>
          </pre>
        </div>
      </Drawer>

      <Drawer
        title="查看JSON数据"
        placement="right"
        closable={false}
        size="large"
        onClose={() => setJsonModalVisible(false)}
        open={jsonModalVisible}
        extra={
          <Space>
            {!isEditing ? (
              <>
                <Button key="edit" icon={<FormOutlined />} type="primary" onClick={handleEditJSON}>
                  编辑JSON
                </Button>
                {/* <Button key="copy" icon={<CopyOutlined />} type="primary" onClick={handleCopyJSON}>
                  复制JSON
                </Button> */}
              </>
            ) : (
              <>
                <Button key="save" type="primary" onClick={handleSaveJSON}>
                  保存
                </Button>
                <Button key="cancel" onClick={handleCancelEdit}>
                  取消
                </Button>
              </>
            )}
            <Button key="close" onClick={() => setJsonModalVisible(false)}>
              关闭
            </Button>
          </Space>
        }
      >
        <div style={{ position: 'relative', height: '100%' }}>
          {isEditing ? (
            <textarea
              ref={jsonTextareaRef}
              value={editedJson}
              onChange={(e) => setEditedJson(e.target.value)}
              style={{ 
                background: '#f6f8fa', 
                color: '#24292e',
                padding: '16px', 
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '13px',
                lineHeight: '1.5',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                border: '1px solid #e1e4e8',
                width: '100%',
                height: '100%',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="请输入有效的JSON数据..."
            />
          ) : (
            <pre 
              ref={jsonPreRef}
              style={{ 
                background: '#f6f8fa', 
                color: '#24292e',
                padding: '16px', 
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '13px',
                lineHeight: '1.5',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                userSelect: 'text',
                cursor: 'text',
                whiteSpace: 'pre-wrap',
                border: '1px solid #e1e4e8',
              }}
            >
              {jsonData}
            </pre>
          )}
        </div>
      </Drawer>
    </div>
  )
}

// 创建表单包装器，应用表单级别的配置
const FormWrapper: React.FC<{ children: React.ReactNode; formConfig: FormConfig }> = ({ children, formConfig }) => {
  // 构建表单属性
  const formProps: any = {
    layout: formConfig.layout,
    labelAlign: formConfig.labelAlign,
    style: { width: '100%' },
    colon: formConfig?.colon,
    labelCol: { span: 3 },
    wrapperCol: { span: 24 },
  }

  // 应用表单尺寸
  if (formConfig.size && formConfig.size !== 'default') {
    formProps.size = formConfig.size
  }

  // 应用标签宽度
  if (formConfig.labelWidth && formConfig.labelWidth !== 'auto') {
    formProps.labelCol = { span: 6 }
    formProps.wrapperCol = { span: 18 }
    // 添加自定义样式来控制标签宽度
    formProps.style = { 
      ...formProps.style,
      '--form-label-width': typeof formConfig.labelWidth === 'number' 
        ? `${formConfig.labelWidth}px` 
        : formConfig.labelWidth,
    }
  }

  // 应用禁用状态
  if (formConfig.disabled) {
    formProps.disabled = true
  }

  return (
    <Form {...formProps}>
      {children}
    </Form>
  )
}

// 根据类型渲染对应的组件
const renderComponentByType = (item: CenterItem, formConfig: FormConfig) => {
  const config = getComponentConfig(item.type)
  if (!config) {
    return (
      <ComponentWrapper title={item.title}>
        <div>未知组件类型: {item.type}</div>
      </ComponentWrapper>
    )
  }
  
  const Component = config.component
  
  // 合并默认属性和自定义属性
  const mergedProps = { ...config.props, ...item.props }
  
  // 应用表单级别的禁用状态
  if (formConfig.disabled) {
    mergedProps.disabled = true
  }
  
  // 处理选项组件（radio 和 checkbox）
  if (COMPONENT_TYPES.OPTION.includes(item.type as any)) {
    const optionsText = item.props?.options || '选项1,选项2,选项3'
    const optionsArray = utils.parseOptionsText(optionsText)
    
    // 为 Radio.Group 和 Checkbox.Group 提供正确的选项格式
    const children = optionsArray.map((option: { label: string; value: string }) => {
      if (item.type === 'radio') {
        return React.createElement(Radio, { 
          key: option.value, 
          value: option.value 
        }, option.label)
      } else {
        return React.createElement(Checkbox, { 
          key: option.value, 
          value: option.value 
        }, option.label)
      }
    })
    
    // 使用 Ant Design 组件，但传递转换后的选项
    const componentProps = {
      ...utils.filterIncompatibleProps(mergedProps),
      options: optionsArray
    }
    
    return (
      <Form.Item label={item.title}>
        <Component {...componentProps}>
          {children}
        </Component>
      </Form.Item>
    )
  }
  
  // 对于布局组件，不显示标签
  if (COMPONENT_TYPES.LAYOUT.includes(item.type as any)) {
    return (
      <Component {...utils.filterIncompatibleProps(mergedProps)}>
        {config.children}
      </Component>
    )
  }
  
  // 对于普通表单组件，显示标签
  return (
    <Form.Item label={item.title}>
      <Component {...utils.filterIncompatibleProps(mergedProps)}>
        {config.children}
      </Component>
    </Form.Item>
  )
}

// SortableItem 组件
const SortableItem: React.FC<{ item: CenterItem; index?: number }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const { selectedItemId, setSelectedItemId, removeCenterItem, formConfig } = useFormStore()
  
  const isSelected = selectedItemId === item.id
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  }
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // 点击组件本身的任何地方都选中该组件
    setSelectedItemId(item.id)
  }, [item.id, setSelectedItemId])

  // 删除中部指定元素
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    removeCenterItem(item.id)
  }, [item.id, removeCenterItem])
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`center-item ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {/* 删除按钮 */}
      <div 
        className="delete-btn"
        onClick={handleDelete}
        style={{
          display: isSelected ? 'flex' : 'none',
        }}
      >
        <IconFont type="icon-shanchu" />
      </div>
      <div className="componentWrap">
        {renderComponentByType(item, formConfig)}
      </div>
    </div>
  )
}

interface CenterProps {
  insertIndex?: number | null
  isDraggingOver?: boolean
}

const Center: React.FC<CenterProps> = ({ insertIndex, isDraggingOver = false }) => {
  const { centerItems, formConfig } = useFormStore()
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })
  
  // 启用键盘快捷键
  useKeyboardShortcuts()

  // 点击空白区域取消选中
  const handleContainerClick = useCallback(() => {
    // setSelectedItemId(null)
  }, [])

  return (
    <div className='centerWrap'>
      <CenterTop />
      <ErrorBoundary>
        <div
          ref={setNodeRef}
          className="center-container"
          style={{
            border: (isOver || isDraggingOver) ? '2px dashed #1890ff' : '2px dashed #eee',
            minHeight: 120,
          }}
          onClick={handleContainerClick}
        >
          {centerItems.length === 0 ? (
            <div className="center-placeholder">请从左侧拖拽组件到这里</div>
          ) : (
            <FormWrapper formConfig={formConfig}>
              {centerItems.map((item: CenterItem, index: number) => (
                <React.Fragment key={item.id}>
                    {/* 在指定位置显示插入指示器 */}
                    {insertIndex === index && <InsertIndicator position="top" />}
                  <SortableItem item={item} index={index} />
                </React.Fragment>
              ))}
            </FormWrapper>
          )}
          {/* 在末尾显示插入指示器 */}
          {insertIndex === centerItems.length && centerItems.length > 0 && (
            <InsertIndicator position="bottom" />
          )}
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default Center
