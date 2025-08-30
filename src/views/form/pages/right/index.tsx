import React, { useState, useMemo, useCallback } from 'react'
import { Tabs, Form, Input, InputNumber, Select, Switch, Divider, Empty, ColorPicker, Slider, Radio, Checkbox, Button } from 'antd'
import { useFormStore } from '@/store/modules/form'
import { getComponentConfig } from '@/views/form/static'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { PropConfig } from '@/views/form/static/type/component'
import './index.scss'

const { TextArea } = Input
const { Option } = Select

// 属性编辑器组件
interface PropEditorProps {
  propName: string
  propConfig: PropConfig
  value: any
  onChange: (propName: string, value: any) => void
}

// 编辑器组件映射配置
const EDITOR_COMPONENTS = {
  string: ({ value, placeholder, onChange }: any) => (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  
  number: ({ value, placeholder, onChange, min, max, step }: any) => (
    <InputNumber
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      style={{ width: '100%' }}
      min={min}
      max={max}
      step={step}
    />
  ),
  
  boolean: ({ value, onChange }: any) => (
    <Switch
      checked={value}
      onChange={onChange}
    />
  ),
  
  select: ({ value, placeholder, onChange, options, allowClear }: any) => (
    <Select
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      style={{ width: '100%' }}
      allowClear={allowClear}
    >
      {options?.map((option: any) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  ),
  
  textarea: ({ value, placeholder, rows, onChange }: any) => (
    <TextArea
      value={value}
      placeholder={placeholder}
      rows={rows || 3}
      onChange={(e) => onChange(e.target.value)}
    />
  ),

  slider: ({ value, onChange, min, max, step, marks }: any) => (
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      marks={marks ? { [min || 0]: min, [max || 100]: max } : undefined}
    />
  ),

  radio: ({ value, onChange, options }: any) => (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options?.map((option: any) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  ),

  checkbox: ({ value, onChange, options }: any) => (
    <Checkbox.Group
      value={value}
      onChange={onChange}
    >
      {options?.map((option: any) => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  ),

  color: ({ value, onChange }: any) => (
    <ColorPicker
      value={value}
      onChange={(color) => onChange(color?.toHexString())}
      showText
    />
  ),
}

const PropEditor: React.FC<PropEditorProps> = React.memo(({ propName, propConfig, value, onChange }) => {
  const handleChange = useCallback((newValue: any) => {
    onChange(propName, newValue)
  }, [propName, onChange])

  // 获取对应的编辑器组件
  const EditorComponent = EDITOR_COMPONENTS[propConfig.type as keyof typeof EDITOR_COMPONENTS] || EDITOR_COMPONENTS.string
  
  // 构建编辑器组件的props
  const editorProps = useMemo(() => ({
    value,
    placeholder: propConfig.placeholder || `请输入${propConfig.label}`,
    onChange: handleChange,
    options: propConfig.options,
    min: propConfig.min,
    max: propConfig.max,
    step: propConfig.step,
    rows: propConfig.rows,
    marks: propConfig.marks,
    allowClear: propConfig.allowClear,
  }), [value, propConfig, handleChange])

  return <EditorComponent {...editorProps} />
})

// 组件属性配置
const ComponentConfig: React.FC = () => {
  const { getSelectedItem, updateCenterItem } = useFormStore()
  const selectedItem = getSelectedItem()

  const handlePropChange = useCallback((propName: string, value: any) => {
    if (!selectedItem) return
    const currentProps = selectedItem.props || {}
    const newProps = { ...currentProps, [propName]: value }
    updateCenterItem(selectedItem.id, { props: newProps })
  }, [selectedItem, updateCenterItem])

  const handleTitleChange = useCallback((title: string) => {
    if (!selectedItem) return
    updateCenterItem(selectedItem.id, { title })
  }, [selectedItem, updateCenterItem])

  const handleVmodelChange = useCallback((vmodel: string) => {
    if (!selectedItem) return
    updateCenterItem(selectedItem.id, { vmodel })
  }, [selectedItem, updateCenterItem])

  // 使用 useMemo 缓存组件配置，避免重复计算
  const config = useMemo(() => {
    if (!selectedItem) return null
    return getComponentConfig(selectedItem.type)
  }, [selectedItem?.type])

  // 使用 useMemo 缓存当前属性，避免重复计算
  const currentProps = useMemo(() => {
    return selectedItem?.props || {}
  }, [selectedItem?.props])

  if (!selectedItem) {
    return (
      <div className="empty-state">
        <Empty 
          description="请先选择一个组件" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="empty-state">
        <Empty 
          description="组件配置不存在" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="componentConfig">
        <div className="config-section">
          <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>基础信息</Divider>
          <Form layout="vertical" name='componentConfig'>
            <Form.Item label="标题" name="title">
              <Input
                value={selectedItem.title}
                placeholder="请输入标题"
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="字段名" name="vmodel">
              <Input
                value={selectedItem.vmodel || config.vmodel || ''}
                placeholder="请输入字段名"
                onChange={(e) => handleVmodelChange(e.target.value)}
              />
            </Form.Item>
          </Form>
        </div>

        {/* 组件属性配置 */}
        {config.propsConfig && Object.keys(config.propsConfig).length > 0 && (
          <div className="config-section">
            <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>组件属性</Divider>
            <Form layout="vertical">
              {Object.entries(config.propsConfig).map(([propName, propConfig]) => {
                const typedPropConfig = propConfig as PropConfig
                const value = currentProps[propName] ?? typedPropConfig.defaultValue
                return (
                  <Form.Item key={propName} label={typedPropConfig.label}>
                    <PropEditor
                      propName={propName}
                      propConfig={typedPropConfig}
                      value={value}
                      onChange={handlePropChange}
                    />
                  </Form.Item>
                )
              })}
            </Form>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

// 表单配置
const FormConfig: React.FC = () => {
  const { centerItems, getSelectedItem, formConfig, updateFormConfig, resetFormConfig } = useFormStore()

  const stats = useMemo(() => ({
    total: centerItems.length,
    configured: centerItems.filter(item => item.props && Object.keys(item.props).length > 0).length,
    selected: centerItems.filter(item => item.id === getSelectedItem()?.id).length
  }), [centerItems, getSelectedItem])

  // 使用 useCallback 优化事件处理函数
  const handleModelNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormConfig({ modelName: e.target.value })
  }, [updateFormConfig])

  const handleLabelWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormConfig({ labelWidth: e.target.value })
  }, [updateFormConfig])

  const handleSizeChange = useCallback((value: 'small' | 'default' | 'large') => {
    updateFormConfig({ size: value })
  }, [updateFormConfig])

  const handleDisabledChange = useCallback((checked: boolean) => {
    updateFormConfig({ disabled: checked })
  }, [updateFormConfig])

  const handleLayoutChange = useCallback((value: 'vertical' | 'horizontal' | 'inline') => {
    updateFormConfig({ layout: value })
  }, [updateFormConfig])

  const handleLabelAlignChange = useCallback((value: 'left' | 'right') => {
    updateFormConfig({ labelAlign: value })
  }, [updateFormConfig])

  const handleColonChange = useCallback((checked: boolean) => {
    updateFormConfig({ colon: checked })
  }, [updateFormConfig])

  const handleShowValidationChange = useCallback((checked: boolean) => {
    updateFormConfig({ showValidation: checked })
  }, [updateFormConfig])

  return (
    <ErrorBoundary>
      <div className="formConfig">
        <div className="config-section">
          <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>表单信息</Divider>
          <Form layout="vertical" name='formConfig'>
            <Form.Item label="表单字段名称" name="modelName">
              <Input 
                placeholder="请输入表单字段名称" 
                value={formConfig.modelName}
                onChange={handleModelNameChange}
              />
            </Form.Item>
            <Form.Item label="标签宽度" name="labelWidth">
              <Input 
                placeholder="请输入标签宽度，如：120px 或 120" 
                value={formConfig.labelWidth}
                onChange={handleLabelWidthChange}
              />
            </Form.Item>
            <Form.Item label="表单尺寸" name="size">
              <Select 
                value={formConfig.size} 
                style={{ width: '100%' }}
                onChange={handleSizeChange}
              >
                <Option value="large">大尺寸</Option>
                <Option value="default">默认尺寸</Option>
                <Option value="small">小尺寸</Option>
              </Select>
            </Form.Item>
            <Form.Item label="禁用表单" name="disabled">
              <Switch 
                checked={formConfig.disabled}
                onChange={handleDisabledChange}
              />
            </Form.Item>
          </Form>

          <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>表单设置</Divider>
          <Form layout="vertical" name='formConfig'>
            <Form.Item label="布局方式" name="layout">
              <Select 
                value={formConfig.layout} 
                style={{ width: '100%' }}
                onChange={handleLayoutChange}
              >
                <Option value="vertical">垂直布局</Option>
                <Option value="horizontal">水平布局</Option>
                <Option value="inline">行内布局</Option>
              </Select>
            </Form.Item>
            <Form.Item label="标签对齐" name="labelAlign">
              <Select 
                value={formConfig.labelAlign} 
                style={{ width: '100%' }}
                onChange={handleLabelAlignChange}
              >
                <Option value="left">左对齐</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
            <Form.Item label="是否添加后缀" name="colon">
              <Switch 
                checked={formConfig.colon}
                onChange={handleColonChange}
              />
            </Form.Item>
            <Form.Item label="显示验证信息" name="showValidation">
              <Switch 
                checked={formConfig.showValidation}
                onChange={handleShowValidationChange}
              />
            </Form.Item>
          </Form>

          <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>恢复默认</Divider>
          <Form layout="vertical">
            <Form.Item>
              <Button 
                type="default" 
                onClick={resetFormConfig}
                style={{ width: '100%' }}
              >
                恢复默认配置
              </Button>
            </Form.Item>
          </Form>

          <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>组件统计</Divider>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">总组件数：</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">已配置：</span>
              <span className="stat-value">{stats.configured}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">已选中：</span>
              <span className="stat-value">{stats.selected}</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

const Right: React.FC = () => {
  const [tabIndex, setTabIndex] = useState('component')

  const tabItems = useMemo(() => [
    { key: 'component', label: '组件属性' },
    { key: 'form', label: '表单配置' },
  ], [])

  const handleTabChange = useCallback((key: string) => {
    setTabIndex(key)
  }, [])

  // 使用 useMemo 缓存渲染的组件，避免不必要的重渲染
  const renderContent = useMemo(() => {
    switch (tabIndex) {
      case 'component':
        return <ComponentConfig />
      case 'form':
        return <FormConfig />
      default:
        return <ComponentConfig />
    }
  }, [tabIndex])

  return (
    <div className="right">
      <Tabs
        activeKey={tabIndex}
        centered
        size="middle"
        items={tabItems}
        className="custom-tabs"
        onChange={handleTabChange}
      />
      <div className="right-board">
        {renderContent}
      </div>
    </div>
  )
}

export default Right
