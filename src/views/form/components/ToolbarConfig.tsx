import React from 'react'
import { Button, Flex } from 'antd'
import { 
  DeleteOutlined, 
  FormOutlined, 
  DownloadOutlined, 
  EyeOutlined 
} from '@ant-design/icons'

interface ToolbarButton {
  key: string
  icon: React.ReactElement
  text: string
  color: 'danger' | 'primary'
  variant: 'filled'
  onClick: () => void
}

interface ToolbarConfigProps {
  onClear: () => void
  onEditJSON: () => void
  onExport: () => void
  onPreview: () => void
}

/**
 * 工具栏配置组件
 * 统一管理工具栏按钮的配置和渲染
 */
export const ToolbarConfig: React.FC<ToolbarConfigProps> = React.memo(({
  onClear,
  onEditJSON,
  onExport,
  onPreview,
}) => {
  const toolbarButtons: ToolbarButton[] = [
    {
      key: 'clear',
      icon: <DeleteOutlined />,
      text: '清空画布',
      color: 'danger',
      variant: 'filled',
      onClick: onClear,
    },
    {
      key: 'edit-json',
      icon: <FormOutlined />,
      text: '编辑JSON',
      color: 'primary',
      variant: 'filled',
      onClick: onEditJSON,
    },
    {
      key: 'export',
      icon: <DownloadOutlined />,
      text: '导出vue文件',
      color: 'primary',
      variant: 'filled',
      onClick: onExport,
    },
    {
      key: 'preview',
      icon: <EyeOutlined />,
      text: '预览代码',
      color: 'primary',
      variant: 'filled',
      onClick: onPreview,
    },
  ]

  return (
    <Flex gap="small" wrap>
      {toolbarButtons.map((button) => (
        <Button
          key={button.key}
          icon={button.icon}
          color={button.color}
          variant={button.variant}
          onClick={button.onClick}
        >
          {button.text}
        </Button>
      ))}
    </Flex>
  )
})

ToolbarConfig.displayName = 'ToolbarConfig'
