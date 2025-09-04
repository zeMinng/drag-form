import React, { useState, useMemo, useCallback } from 'react'
import { Tabs, Form, Input, Select, Switch, Divider, Empty, Button } from 'antd'
import { useFormStore } from '@/store/modules/form'
import { getComponentConfig } from '@/views/form/static'
import type { PropConfig } from '@/views/form/static/type/component'
import './index.scss'
import PropEditor from './components/PropEditor'

const { Option } = Select

// PropEditor 组件已提取到 components/PropEditor.tsx

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
  
  // 布局型组件不需要基础信息配置
  const isLayoutComponent = config.category === 'layout'

  return (
    <div className="componentConfig">
      {/* 只有非布局型组件才显示基础信息 */}
      {!isLayoutComponent && (
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
      )}

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

  return (
    <div className="formConfig">
      <div className="config-section">
        <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>表单信息</Divider>
        <Form layout="vertical">
          <Form.Item label="表单字段名称">
            <Input 
              placeholder="请输入表单字段名称" 
              value={formConfig.modelName}
              onChange={(e) => updateFormConfig({ modelName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="标签宽度">
            <Input 
              placeholder="请输入标签宽度，如：120px 或 120" 
              value={formConfig.labelWidth}
              onChange={(e) => updateFormConfig({ labelWidth: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="表单尺寸">
            <Select 
              value={formConfig.size} 
              style={{ width: '100%' }}
              onChange={(value) => updateFormConfig({ size: value })}
            >
              <Option value="large">大尺寸</Option>
              <Option value="default">默认尺寸</Option>
              <Option value="small">小尺寸</Option>
            </Select>
          </Form.Item>
          <Form.Item label="禁用表单">
            <Switch 
              checked={formConfig.disabled}
              onChange={(checked) => updateFormConfig({ disabled: checked })}
            />
          </Form.Item>
        </Form>

        <Divider size="small" dashed plain variant="dashed" style={{ borderColor: '#e9ecf0' }}>表单设置</Divider>
        <Form layout="vertical">
          <Form.Item label="布局方式">
            <Select 
              value={formConfig.layout} 
              style={{ width: '100%' }}
              onChange={(value) => updateFormConfig({ layout: value })}
            >
              <Option value="vertical">垂直布局</Option>
              <Option value="horizontal">水平布局</Option>
              <Option value="inline">行内布局</Option>
            </Select>
          </Form.Item>
          <Form.Item label="标签对齐">
            <Select 
              value={formConfig.labelAlign} 
              style={{ width: '100%' }}
              onChange={(value) => updateFormConfig({ labelAlign: value })}
            >
              <Option value="left">左对齐</Option>
              <Option value="right">右对齐</Option>
            </Select>
          </Form.Item>
          <Form.Item label="是否添加后缀">
            <Switch 
              checked={formConfig.colon}
              onChange={(checked) => updateFormConfig({ colon: checked })}
            />
          </Form.Item>
          <Form.Item label="显示验证信息">
            <Switch 
              checked={formConfig.showValidation}
              onChange={(checked) => updateFormConfig({ showValidation: checked })}
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
