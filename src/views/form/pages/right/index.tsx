import React, { useState, useMemo, useCallback } from 'react'
import { Tabs, Form, Input, InputNumber, Select, Switch, Divider, Empty, ColorPicker, Slider, Radio, Checkbox } from 'antd'
import { useFormStore } from '@/store/modules/form'
import { getComponentConfig } from '@/views/form/static/utils/componentRegistry'
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

const PropEditor: React.FC<PropEditorProps> = React.memo(({ propName, propConfig, value, onChange }) => {
  const handleChange = useCallback((newValue: any) => {
    onChange(propName, newValue)
  }, [propName, onChange])

  switch (propConfig.type) {
    case 'string':
      return (
        <Input
          value={value}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          onChange={(e) => handleChange(e.target.value)}
        />
      )
    
    case 'number':
      return (
        <InputNumber
          value={value}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          onChange={handleChange}
          style={{ width: '100%' }}
          min={propConfig.min}
          max={propConfig.max}
          step={propConfig.step}
        />
      )
    
    case 'boolean':
      return (
        <Switch
          checked={value}
          onChange={handleChange}
        />
      )
    
    case 'select':
      return (
        <Select
          value={value}
          placeholder={propConfig.placeholder || `请选择${propConfig.label}`}
          onChange={handleChange}
          style={{ width: '100%' }}
          allowClear={propConfig.allowClear}
        >
          {propConfig.options?.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )
    
    case 'textarea':
      return (
        <TextArea
          value={value}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          rows={propConfig.rows || 3}
          onChange={(e) => handleChange(e.target.value)}
        />
      )

    case 'slider':
      return (
        <Slider
          value={value}
          onChange={handleChange}
          min={propConfig.min}
          max={propConfig.max}
          step={propConfig.step}
          marks={propConfig.marks ? { [propConfig.min || 0]: propConfig.min, [propConfig.max || 100]: propConfig.max } : undefined}
        />
      )

    case 'radio':
      return (
        <Radio.Group
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        >
          {propConfig.options?.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      )

    case 'checkbox':
      return (
        <Checkbox.Group
          value={value}
          onChange={handleChange}
        >
          {propConfig.options?.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )

    case 'color':
      return (
        <ColorPicker
          value={value}
          onChange={(color) => handleChange(color?.toHexString())}
          showText
        />
      )
    
    default:
      return (
        <Input
          value={value}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          onChange={(e) => handleChange(e.target.value)}
        />
      )
  }
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

  const config = getComponentConfig(selectedItem.type)
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
  
  const currentProps = selectedItem.props || {}

  return (
    <div className="componentConfig">
      <div className="config-section">
        <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>基础信息</Divider>
        <Form layout="vertical">
          <Form.Item label="标题">
            <Input
              value={selectedItem.title}
              placeholder="请输入标题"
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="字段名">
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
              const value = currentProps[propName] ?? propConfig.defaultValue
              return (
                <Form.Item key={propName} label={propConfig.label}>
                  <PropEditor
                    propName={propName}
                    propConfig={propConfig}
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
  )
}

// 表单配置
const FormConfig: React.FC = () => {
  const { centerItems, getSelectedItem } = useFormStore()

  const stats = useMemo(() => ({
    total: centerItems.length,
    configured: centerItems.filter(item => item.props && Object.keys(item.props).length > 0).length,
    selected: centerItems.filter(item => item.id === getSelectedItem()?.id).length
  }), [centerItems, getSelectedItem])

  return (
    <div className="formConfig">
      <div className="config-section">
        <h4>表单信息</h4>
        <Form layout="vertical" size="small">
          <Form.Item label="表单标题">
            <Input placeholder="请输入表单标题" />
          </Form.Item>
          <Form.Item label="表单描述">
            <TextArea placeholder="请输入表单描述" rows={3} />
          </Form.Item>
        </Form>
      </div>

      <Divider />

      <div className="config-section">
        <h4>表单设置</h4>
        <Form layout="vertical" size="small">
          <Form.Item label="布局方式">
            <Select defaultValue="vertical" style={{ width: '100%' }}>
              <Option value="vertical">垂直布局</Option>
              <Option value="horizontal">水平布局</Option>
              <Option value="inline">行内布局</Option>
            </Select>
          </Form.Item>
          <Form.Item label="标签对齐">
            <Select defaultValue="right" style={{ width: '100%' }}>
              <Option value="left">左对齐</Option>
              <Option value="right">右对齐</Option>
              <Option value="top">顶部对齐</Option>
            </Select>
          </Form.Item>
          <Form.Item label="显示验证信息">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </div>

      <Divider />

      <div className="config-section">
        <h4>组件统计</h4>
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
        {tabIndex === 'component' && <ComponentConfig />}
        {tabIndex === 'form' && <FormConfig />}
      </div>
    </div>
  )
}

export default Right
