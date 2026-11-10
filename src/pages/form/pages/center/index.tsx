import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { App, Flex, Button, message, Drawer, Space, Form } from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  CopyOutlined,
  FormOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// Set global Prism for modular components
if (typeof window !== 'undefined') {
  window.Prism = window.Prism || Prism
}

import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'

// Configure Prism to support TypeScript syntax inside script tags in Vue/HTML files
if (Prism.languages.markup && Prism.languages.typescript) {
  Prism.languages.insertBefore('markup', 'script', {
    'typescript-script': {
      pattern:
        /(<script[\s\S]*?lang=["']?(?:ts|typescript|tsx)["']?[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
      lookbehind: true,
      inside: Prism.languages.typescript,
    },
  })
  Prism.languages.html = Prism.languages.markup
}

import IconFont from '@/components/business/Icon'
import DownloadOutVue from '../downloadOutVue/index'
import { useFormStore, type CenterItem, type FormConfig } from '@/store/modules/form'
import {
  generateVueComponent,
  generateReactComponent,
  renderComponentByType,
  getComponentConfig,
} from '@/pages/form/static'
import type { ExportCodeTarget } from '../downloadOutVue/index'
// import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

import './index.scss'

function isCenterItemArray(value: unknown): value is CenterItem[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown): item is CenterItem => {
      if (typeof item !== 'object' || item === null) return false
      const candidate = item as Record<string, unknown>
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.type === 'string' &&
        typeof candidate.title === 'string'
      )
    })
  )
}

const CanvasTools: React.FC = () => {
  const { modal } = App.useApp()

  const clearTheCanvas = () => {
    modal.confirm({
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

  return (
    <Button icon={<DeleteOutlined />} color="danger" variant="filled" onClick={clearTheCanvas}>
      清空画布
    </Button>
  )
}

const CenterTop: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [codeModalVisible, setCodeModalVisible] = useState(false)
  const [codeTarget, setCodeTarget] = useState<ExportCodeTarget>('vue')
  const [jsonModalVisible, setJsonModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedJson, setEditedJson] = useState('')
  const [copied, setCopied] = useState(false)
  const { centerItems, updateItems, formConfig } = useFormStore()
  const codeRef = useRef<HTMLPreElement>(null)
  const jsonTextareaRef = useRef<HTMLTextAreaElement>(null)
  const jsonPreRef = useRef<HTMLPreElement>(null)

  const handleViewCode = useCallback(() => {
    setCodeModalVisible(true)
  }, [])

  const getGeneratedCode = useCallback(
    (target: ExportCodeTarget) =>
      target === 'react'
        ? generateReactComponent(centerItems, formConfig)
        : generateVueComponent(centerItems, formConfig),
    [centerItems, formConfig],
  )

  const handleCopyCode = useCallback(async () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString()
    const source = codeRef.current?.querySelector('code')
    const isSelectionFromPreview = Boolean(
      selectedText &&
      source &&
      selection?.anchorNode &&
      selection.focusNode &&
      source.contains(selection.anchorNode) &&
      source.contains(selection.focusNode),
    )
    const codeToCopy = isSelectionFromPreview ? (selectedText ?? '') : getGeneratedCode(codeTarget)

    try {
      await navigator.clipboard.writeText(codeToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      message.success('代码已复制到剪贴板')
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = codeToCopy
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.append(textArea)
      textArea.select()
      const copiedToClipboard = document.execCommand('copy')
      textArea.remove()

      if (copiedToClipboard) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        message.success('代码已复制到剪贴板')
      }
    }
  }, [codeTarget, getGeneratedCode])

  const handleViewJSON = useCallback(() => {
    setJsonModalVisible(true)
    setEditedJson(JSON.stringify(centerItems, null, 2))
    setIsEditing(false)
  }, [centerItems])

  const handleEditJSON = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleSaveJSON = useCallback(() => {
    try {
      const parsedData = JSON.parse(editedJson)
      // 验证数据结构
      if (isCenterItemArray(parsedData)) {
        updateItems(parsedData)
        message.success('JSON数据已成功更新')
        setIsEditing(false)
      } else {
        message.error('JSON数据格式不正确，每个项目必须包含 id、type、title 字段')
      }
    } catch {
      message.error('JSON格式错误，请检查语法')
    }
  }, [editedJson, updateItems])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditedJson(JSON.stringify(centerItems, null, 2))
  }, [centerItems])

  const generatedCode = useMemo(() => getGeneratedCode(codeTarget), [getGeneratedCode, codeTarget])
  const codeLanguageClass = codeTarget === 'react' ? 'language-tsx' : 'language-html'
  const jsonData = useMemo(() => JSON.stringify(centerItems, null, 2), [centerItems])

  const lines = useMemo(() => generatedCode.split('\n'), [generatedCode])
  const lineNumbers = useMemo(() => lines.map((_, index) => index + 1).join('\n'), [lines])

  const codeSize = useMemo(() => {
    const bytes = new Blob([generatedCode]).size
    if (bytes < 1024) return `${bytes} B`
    return `${(bytes / 1024).toFixed(2)} KB`
  }, [generatedCode])

  const highlightCode = useCallback(() => {
    if (codeRef.current) {
      const codeEl = codeRef.current.querySelector('code')
      if (codeEl) {
        codeEl.removeAttribute('data-highlighted')
        Prism.highlightElement(codeEl)
      }
    }
  }, [])

  useEffect(() => {
    if (codeModalVisible) {
      const timer = setTimeout(highlightCode, 50)
      return () => clearTimeout(timer)
    }
  }, [codeModalVisible, generatedCode, highlightCode])

  return (
    <div className="centerTop">
      <Flex gap="small" wrap>
        <CanvasTools />
        <Button icon={<FormOutlined />} color="primary" variant="filled" onClick={handleViewJSON}>
          编辑JSON
        </Button>
        <Button
          icon={<DownloadOutlined />}
          color="primary"
          variant="filled"
          onClick={() => setModalVisible(true)}
        >
          导出代码
        </Button>
        <Button icon={<EyeOutlined />} color="primary" variant="filled" onClick={handleViewCode}>
          预览代码
        </Button>
      </Flex>

      <DownloadOutVue open={modalVisible} onClose={() => setModalVisible(false)} />

      <Drawer
        className="code-preview-drawer"
        title="预览代码"
        placement="right"
        size="large"
        onClose={() => setCodeModalVisible(false)}
        open={codeModalVisible}
        destroyOnHidden
        afterOpenChange={(open) => {
          if (open) {
            setTimeout(highlightCode, 50)
          }
        }}
        styles={{
          body: {
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
        extra={
          <Button key="close" onClick={() => setCodeModalVisible(false)}>
            关闭
          </Button>
        }
      >
        <section className="code-preview" aria-label="生成代码预览">
          <header className="code-preview__toolbar">
            <div className="code-preview__window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="code-preview__tabs" role="tablist" aria-label="导出格式">
              <button
                className={`code-preview__tab${codeTarget === 'vue' ? ' is-active is-vue' : ''}`}
                role="tab"
                aria-selected={codeTarget === 'vue'}
                onClick={() => setCodeTarget('vue')}
              >
                <span className="code-preview__file-icon code-preview__file-icon--vue">V</span>
                App.vue
              </button>
              <button
                className={`code-preview__tab${codeTarget === 'react' ? ' is-active is-react' : ''}`}
                role="tab"
                aria-selected={codeTarget === 'react'}
                onClick={() => setCodeTarget('react')}
              >
                <span className="code-preview__file-icon code-preview__file-icon--react">R</span>
                GeneratedForm.tsx
              </button>
            </div>
            <div className="code-preview__toolbar-actions">
              <span className="code-preview__size">{codeSize}</span>
              <Button
                type="text"
                size="small"
                className="code-preview__copy"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopyCode}
              >
                {copied ? '已复制' : '复制所选 / 全部'}
              </Button>
            </div>
          </header>
          <p className="code-preview__copy-hint">选中代码片段后点击复制；没有选中内容时复制全部</p>

          <div className="code-preview__editor">
            <pre className="code-preview__gutter" aria-hidden="true">
              {lineNumbers}
            </pre>
            <pre ref={codeRef} className={`code-preview__source ${codeLanguageClass}`}>
              <code className={codeLanguageClass}>{generatedCode}</code>
            </pre>
          </div>

          <footer className="code-preview__statusbar">
            <span>
              {codeTarget === 'vue'
                ? 'Vue 3 · TypeScript · Element Plus'
                : 'React · TypeScript · Ant Design'}
            </span>
            <span>UTF-8&nbsp; · &nbsp;{lines.length} 行</span>
          </footer>
        </section>
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
const FormWrapper: React.FC<{ children: React.ReactNode; formConfig: FormConfig }> = ({
  children,
  formConfig,
}) => {
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
      '--form-label-width':
        typeof formConfig.labelWidth === 'number'
          ? `${formConfig.labelWidth}px`
          : formConfig.labelWidth,
    }
  }

  // 应用禁用状态
  if (formConfig.disabled) {
    formProps.disabled = true
  }

  return <Form {...formProps}>{children}</Form>
}

// 渲染函数已抽取到 core/renderer/componentUtils.ts 中

// 判断是否为布局型组件（通过注册中心元信息，便于扩展）
const isLayoutType = (type: string) => {
  const cfg = getComponentConfig(type)
  return cfg?.category === 'layout'
}

// 递归渲染布局组件 children，并为布局组件提供内部可投放区域
const NestedItem: React.FC<{ item: CenterItem; formConfig: FormConfig }> = ({
  item,
  formConfig,
}) => {
  // Hooks 必须无条件调用，避免早返回前后顺序改变
  const { setNodeRef: setContainerRef, isOver: isContainerOver } = useDroppable({
    id: `container-${item.id}`,
  })
  const { selectedItemId, setSelectedItemId, removeCenterItem } = useFormStore()
  const isSelected = selectedItemId === item.id
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      removeCenterItem(item.id)
    },
    [item.id, removeCenterItem],
  )

  if (!isLayoutType(item.type)) {
    return (
      <div
        className={`nested-item nested-clickable${isSelected ? ' selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedItemId(item.id)
        }}
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
      isSelected ? 'is-selected' : '',
    ]
      .filter(Boolean)
      .join(' ')

    const meta =
      item.type === 'row'
        ? typeof (appliedProps as any).gutter === 'number'
          ? `(gutter:${(appliedProps as any).gutter})`
          : ''
        : typeof (appliedProps as any).span === 'number'
          ? `(span:${(appliedProps as any).span})`
          : ''

    const layoutStyle =
      item.type === 'row'
        ? { width: '100%', ...((mergedProps as any).style || {}) }
        : (mergedProps as any).style || {}

    const isDisplay = item.type === 'row' && item?.children?.length
    return (
      <Component
        {...appliedProps}
        ref={setContainerRef}
        className={combinedClassName}
        data-layout-label={item.type === 'row' ? '行' : '列'}
        data-meta={meta}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          setSelectedItemId(item.id)
        }}
        style={layoutStyle}
      >
        <div
          className="delete-btn"
          onClick={handleDelete}
          style={{ display: isSelected && !isDisplay ? 'flex' : 'none' }}
        >
          <IconFont type="icon-shanchu" />
        </div>
        {childNodes.length ? (
          item.type === 'col' ? (
            <div className="col-inner">{childNodes}</div>
          ) : (
            childNodes
          )
        ) : (
          <div className="center-placeholder">拖到这里</div>
        )}
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
        onClick={(e) => {
          e.stopPropagation()
          setSelectedItemId(item.id)
        }}
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const { selectedItemId, setSelectedItemId, removeCenterItem, formConfig } = useFormStore()

  const isSelected = selectedItemId === item.id

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  }

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      // 点击组件本身的任何地方都选中该组件
      setSelectedItemId(item.id)
    },
    [item.id, setSelectedItemId],
  )

  // 删除中部指定元素
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      removeCenterItem(item.id)
    },
    [item.id, removeCenterItem],
  )

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
        {isLayoutType(item.type) ? (
          <NestedItem item={item} formConfig={formConfig} />
        ) : (
          renderComponentByType(item, formConfig)
        )}
      </div>
    </div>
  )
}

const Center: React.FC<{
  insertIndex?: number | null
  isDraggingOver?: boolean
}> = ({ insertIndex, isDraggingOver = false }) => {
  const { centerItems, formConfig, setSelectedItemId } = useFormStore()
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  /**
   * 使用 useKeyboardShortcuts 处理键盘快捷键
   */
  /**
   * 使用 useKeyboardShortcuts 处理键盘快捷键
   * 暂时不用
   */
  // useKeyboardShortcuts({
  //   onDelete: (item) => {
  //     removeCenterItem(item.id)
  //   },
  //   onCopy: () => {
  //     // 复制逻辑已在 hook 内部处理
  //   },
  //   onPaste: (clonedItem, targetItem) => {
  //     if (!clonedItem) return

  //     if (targetItem) {
  //       const newItems = insertSiblingAfter(centerItems, targetItem.id, clonedItem)
  //       updateItems(newItems)
  //     } else {
  //       updateItems([...centerItems, clonedItem])
  //     }
  //     setSelectedItemId(clonedItem.id)
  //   },
  //   getSelectedItem
  // })

  // 点击空白区域取消选中
  const handleContainerClick = useCallback(() => {
    setSelectedItemId(null)
  }, [setSelectedItemId])

  return (
    <div className="centerWrap">
      <CenterTop />
      <div
        ref={setNodeRef}
        className="center-container"
        style={{
          border:
            isOver || isDraggingOver ? '2px dashed #1890ff' : '2px dashed var(--border-dashed)',
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
