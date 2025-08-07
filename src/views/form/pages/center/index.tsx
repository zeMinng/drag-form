import React, { useState, useRef, useMemo, useCallback } from 'react'
import { Modal, Flex, Button, message, Radio, Checkbox, Drawer, Space } from 'antd'
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
import { useFormStore, type CenterItem } from '@/store/modules/form'
import { getComponentConfig } from '@/views/form/static/utils/componentRegistry'
import { ComponentWrapper } from '@/views/form/static/utils/componentRenderer'
import { generateVueComponent } from '@/views/form/static/utils/codeGenerator'
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
  const { centerItems, updateCenterItems } = useFormStore()
  const codeRef = useRef<HTMLPreElement>(null)
  const jsonTextareaRef = useRef<HTMLTextAreaElement>(null)
  const jsonPreRef = useRef<HTMLPreElement>(null)

  const handleViewCode = useCallback(() => {
    setCodeModalVisible(true)
  }, [])

  const handleCopyCode = useCallback(async () => {
    try {
      const generatedCode = generateVueComponent(centerItems)
      await navigator.clipboard.writeText(generatedCode)
      message.success('代码已复制到剪贴板')
    } catch (error) {
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
  }, [centerItems])

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
          updateCenterItems(parsedData)
          message.success('JSON数据已成功更新')
          setIsEditing(false)
        } else {
          message.error('JSON数据格式不正确，每个项目必须包含id、type、title字段')
        }
      } else {
        message.error('JSON数据必须是数组格式')
      }
    } catch (error) {
      message.error('JSON格式错误，请检查语法')
    }
  }, [editedJson, updateCenterItems])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditedJson(JSON.stringify(centerItems, null, 2))
  }, [centerItems])

  const generatedCode = useMemo(() => generateVueComponent(centerItems), [centerItems])
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
        {/* <Button icon={<PlayCircleOutlined />} color="primary" variant="filled">
          运行
        </Button> */}
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

// 根据类型渲染对应的组件
const renderComponentByType = (item: CenterItem) => {
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
  
  // 过滤掉不兼容的属性，避免 React 警告
  const filterIncompatibleProps = (props: any) => {
    const { clearable, ...rest } = props
    return rest
  }
  
  // 处理 radio 和 checkbox 的选项配置
  if (item.type === 'radio' || item.type === 'checkbox') {
    const optionsText = item.props?.options || '选项1,选项2,选项3'
    const optionsArray = optionsText.split(',').map((option: string, index: number) => ({
      label: option.trim(),
      value: `option${index + 1}`
    }))
    
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
      ...filterIncompatibleProps(mergedProps),
      options: optionsArray // 传递转换后的选项数组
    }
    
    return (
      <ComponentWrapper title={item.title}>
        <Component {...componentProps}>
          {children}
        </Component>
      </ComponentWrapper>
    )
  }
  
  return (
    <ComponentWrapper title={item.title}>
      <Component {...filterIncompatibleProps(mergedProps)}>
        {config.children}
      </Component>
    </ComponentWrapper>
  )
}

// SortableItem 组件
const SortableItem: React.FC<{ item: CenterItem; index?: number }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const { selectedItemId, setSelectedItemId, removeCenterItem } = useFormStore()
  
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
        {renderComponentByType(item)}
      </div>
    </div>
  )
}

interface CenterProps {
  insertIndex?: number | null
  isDraggingOver?: boolean
}

const Center: React.FC<CenterProps> = ({ insertIndex, isDraggingOver = false }) => {
  const { centerItems } = useFormStore()
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  // 点击空白区域取消选中
  const handleContainerClick = useCallback(() => {
    // setSelectedItemId(null)
  }, [])

  return (
    <div className='centerWrap'>
      <CenterTop />
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
          centerItems.map((item: CenterItem, index: number) => (
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
          ))
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
