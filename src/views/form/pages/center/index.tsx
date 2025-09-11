import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Modal, Flex, Button, message, Drawer, Space, Form } from 'antd'
import { DeleteOutlined, EyeOutlined, DownloadOutlined, CopyOutlined, FormOutlined } from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import IconFont from '@/components/Icon'
import DownloadOutVue from '../downloadOutVue/index'
import { useFormStore, type CenterItem, type FormConfig } from '@/store/modules/form'
import { generateVueComponent } from '@/views/form/static'
import { renderComponentByType } from '@/views/form/static/core/renderer/componentUtils'
import { getComponentConfig } from '@/views/form/static/core/registry/componentRegistry'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
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

  const handleViewCode = useCallback(() => {
    setCodeModalVisible(true)
  }, [])

  const handleCopyCode = useCallback(async () => {
    try {
      const generatedCode = generateVueComponent(centerItems, formConfig)
      await navigator.clipboard.writeText(generatedCode)
      message.success('代码已复制到剪贴板')
    } catch {
      // 如果 clipboard API 不可用，使用传统方法
      if (codeRef.current) {
        const range = document.createRange()
        range.selectNodeContents(codeRef.current)
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('copy')
          selection.removeAllRanges()
          message.success('代码已复制到剪贴板')
        }
      }
    }
  }, [centerItems, formConfig])

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
      // 验证数据结构
      if (Array.isArray(parsedData)) {
        // 验证每个项目都有必要的字段
        const isValidData = parsedData.every((item: any) => 
          item && typeof item === 'object' && 
          item.id && item.type && item.title
        )
        
        if (isValidData) {
          updateItems(parsedData)
          message.success('JSON数据已成功更新')
          setIsEditing(false)
        } else {
          message.error('JSON数据格式不正确，每个项目必须包含id、type、title字段')
        }
      } else {
        message.error('JSON数据必须是数组格式')
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
      <Flex gap="small" wrap>
        <Button icon={<DeleteOutlined />} color="danger" variant="filled" onClick={() => clearTheCanvas()}>
          清空画布
        </Button>
        <Button icon={<FormOutlined />} color="primary" variant="filled" onClick={handleViewJSON}>
          编辑JSON
        </Button>
        <Button icon={<DownloadOutlined />} color="primary" variant="filled" onClick={() => setModalVisible(true)}>
          导出vue文件
        </Button>
        <Button icon={<EyeOutlined />} color="primary" variant="filled" onClick={handleViewCode}>
          预览代码
        </Button>
      </Flex>

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
              background: 'var(--bg-dark)',
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
                background: 'var(--code-bg)', 
                color: 'var(--code-text)',
                padding: '16px', 
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '13px',
                lineHeight: '1.5',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                border: '1px solid var(--code-border)',
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
                background: 'var(--code-bg)', 
                color: 'var(--code-text)',
                padding: '16px', 
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '13px',
                lineHeight: '1.5',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                userSelect: 'text',
                cursor: 'text',
                whiteSpace: 'pre-wrap',
                border: '1px solid var(--code-border)',
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

// 渲染函数已抽取到 core/renderer/componentUtils.ts 中

// 判断是否为布局型组件（通过注册中心元信息，便于扩展）
const isLayoutType = (type: string) => {
  const cfg = getComponentConfig(type)
  return cfg?.category === 'layout'
}

// 递归渲染布局组件 children，并为布局组件提供内部可投放区域
const NestedItem: React.FC<{ item: CenterItem; formConfig: FormConfig }> = ({ item, formConfig }) => {
  // Hooks 必须无条件调用，避免早返回前后顺序改变
  const { setNodeRef: setContainerRef, isOver: isContainerOver } = useDroppable({ id: `container-${item.id}` })
  const { selectedItemId, setSelectedItemId, removeCenterItem } = useFormStore()
  const isSelected = selectedItemId === item.id
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    removeCenterItem(item.id)
  }, [item.id, removeCenterItem])

  if (!isLayoutType(item.type)) {
    return (
      <div
        className={`nested-item nested-clickable${isSelected ? ' selected' : ''}`}
        onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id) }}
        style={{ position: 'relative' }}
      >
        <div 
          className="delete-btn"
          onClick={handleDelete}
          style={{ display: isSelected ? 'flex' : 'none' }}
        >
          <IconFont type="icon-shanchu" />
        </div>
        {renderComponentByType(item, formConfig)}
      </div>
    )
  }

  const config = getComponentConfig(item.type)
  if (!config) return <div className="nested-item">未知组件类型: {item.type}</div>

  const Component: any = config.component as any
  const mergedProps = { ...(config.props || {}), ...(item.props || {}) }
  // Col 未设置 span 时，默认按 24 占满一行，实现“无参数纵向排列”
  const appliedProps: any = { ...mergedProps }
  if (item.type === 'col' && (appliedProps.span === undefined || appliedProps.span === null)) {
    appliedProps.span = 24
  }

  const childNodes = (item.children || []).map((child) => (
    <NestedItem key={child.id} item={child} formConfig={formConfig} />
  ))

  // Row/Col 直接作为容器投放区，避免额外包裹元素影响栅格宽度
  if (item.type === 'row' || item.type === 'col') {
    const baseClass = item.type === 'row' ? 'layout-row' : 'layout-col'
    const isEmpty = childNodes.length === 0
    const combinedClassName = [
      (mergedProps as any).className,
      baseClass,
      isEmpty ? 'is-empty' : '',
      isContainerOver ? 'drag-over' : '',
      isSelected ? 'is-selected' : ''
    ].filter(Boolean).join(' ')

    const meta = item.type === 'row'
      ? (typeof (appliedProps as any).gutter === 'number' ? `(gutter:${(appliedProps as any).gutter})` : '')
      : (typeof (appliedProps as any).span === 'number' ? `(span:${(appliedProps as any).span})` : '')

    const layoutStyle = item.type === 'row'
    ? { width: '100%', ...(mergedProps as any).style || {} }
    : (mergedProps as any).style || {}
    
    const isDisplay = item.type === 'row' && item?.children?.length
    return (
      <Component
        {...appliedProps}
        ref={setContainerRef}
        className={combinedClassName}
        data-layout-label={item.type === 'row' ? '行' : '列'}
        data-meta={meta}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedItemId(item.id) }}
        style={layoutStyle}
      >
        <div 
          className="delete-btn"
          onClick={handleDelete}
          style={{ display: isSelected && !isDisplay ? 'flex' : 'none' }}
        >
          <IconFont type="icon-shanchu" />
        </div>
        {childNodes.length
          ? (item.type === 'col' ? <div className="col-inner">{childNodes}</div> : childNodes)
          : <div className="center-placeholder">拖到这里</div>}
      </Component>
    )
  }

  // 其他布局型（如 card/group）保留内部包裹以显示边框
  return (
    <Component {...mergedProps}>
      <div
        ref={setContainerRef}
        className={`layout-children${isContainerOver ? ' drag-over' : ''}`}
        style={{ minHeight: 24, position: 'relative' }}
        onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id) }}
      >
        <div 
          className="delete-btn"
          onClick={handleDelete}
          style={{ display: isSelected ? 'flex' : 'none' }}
        >
          <IconFont type="icon-shanchu" />
        </div>
        {childNodes.length ? childNodes : <div className="center-placeholder">拖到这里</div>}
      </div>
    </Component>
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
        {isLayoutType(item.type)
          ? <NestedItem item={item} formConfig={formConfig} />
          : renderComponentByType(item, formConfig)}
      </div>
    </div>
  )
}

interface CenterProps {
  insertIndex?: number | null
  isDraggingOver?: boolean
}

const Center: React.FC<CenterProps> = ({ insertIndex, isDraggingOver = false }) => {
  const { centerItems, formConfig, updateItems, removeCenterItem, getSelectedItem, setSelectedItemId } = useFormStore()
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  /** 键盘快捷键处理 */
  // 在树中将 newNode 插入到 targetId 的后面（作为同级）
  const insertSiblingAfter = useCallback((items: CenterItem[], targetId: string, newNode: CenterItem): CenterItem[] => {
    const rootIndex = items.findIndex((it) => it.id === targetId)
    if (rootIndex !== -1) {
      const newItems = [...items]
      newItems.splice(rootIndex + 1, 0, newNode)
      return newItems
    }

    return items.map((node) => {
      if (Array.isArray(node.children) && node.children.length) {
        const idx = node.children.findIndex((c) => c.id === targetId)
        if (idx !== -1) {
          const newChildren = [...node.children]
          newChildren.splice(idx + 1, 0, newNode)
          return { ...node, children: newChildren }
        }
        return { ...node, children: insertSiblingAfter(node.children as any, targetId, newNode) }
      }
      return node
    })
  }, [])
  // 键盘快捷键处理
  useKeyboardShortcuts({
    onDelete: (item) => {
      removeCenterItem(item.id)
    },
    onCopy: () => {
      // 复制逻辑已在 hook 内部处理
    },
    onPaste: (clonedItem, targetItem) => {
      if (!clonedItem) return
      
      if (targetItem) {
        const newItems = insertSiblingAfter(centerItems, targetItem.id, clonedItem)
        updateItems(newItems)
      } else {
        updateItems([...centerItems, clonedItem])
      }
      setSelectedItemId(clonedItem.id)
    },
    getSelectedItem
  })

  // 点击空白区域取消选中
  const handleContainerClick = useCallback(() => {
    setSelectedItemId(null)
  }, [])

  return (
    <div className='centerWrap'>
      <CenterTop />
      <div
        ref={setNodeRef}
        className="center-container"
        style={{
          border: (isOver || isDraggingOver) ? '2px dashed #1890ff' : '2px dashed var(--border-dashed)',
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
                {insertIndex === index && (
                  <div className="insert-indicator insert-top">
                    <div className="insert-line"></div>
                    <div className="insert-dot">拖到这里</div>
                  </div>
                )}
                <SortableItem item={item} index={index} />
              </React.Fragment>
            ))}
          </FormWrapper>
        )}
        {/* 在末尾显示插入指示器 */}
        {insertIndex === centerItems.length && centerItems.length > 0 && (
          <div className="insert-indicator insert-bottom">
            <div className="insert-line"></div>
            <div className="insert-dot">拖到这里</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Center
