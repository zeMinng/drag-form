import React, { useState } from 'react'
import { Tabs, Form, Input, InputNumber, Select, Switch, Divider, Empty, ColorPicker, Slider, Radio, Checkbox } from 'antd'
import { useFormStore } from '@/store/modules/form'
import { getComponentConfig } from '../../static/formComponents/formComponents'
import './index.scss'

const { TextArea } = Input
const { Option } = Select

// 组件属性配置
const ComponentConfig: React.FC = () => {
  const { getSelectedItem, updateCenterItem } = useFormStore()
  const selectedItem = getSelectedItem()
  console.log('%c [ selectedItem ]-14', 'font-size:13px; background:pink; color:#bf2c9f;', selectedItem)

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
  const currentProps = selectedItem.props || {}

  const handlePropChange = (propName: string, value: any) => {
    const newProps = { ...currentProps, [propName]: value }
    updateCenterItem(selectedItem.id, { props: newProps })
  }

  const handleTitleChange = (title: string) => {
    updateCenterItem(selectedItem.id, { title })
  }

  // const handleDescriptionChange = (description: string) => {
  //   updateCenterItem(selectedItem.id, { description })
  // }

  // 渲染属性编辑器
  const renderPropEditor = (propName: string, propConfig: any) => {
    const value = currentProps[propName] ?? propConfig.defaultValue

    switch (propConfig.type) {
      case 'string':
        return (
          <Input
            value={value}
            placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
            onChange={(e) => handlePropChange(propName, e.target.value)}
          />
        )
      
      case 'number':
        return (
          <InputNumber
            value={value}
            placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
            onChange={(val) => handlePropChange(propName, val)}
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
            onChange={(checked) => handlePropChange(propName, checked)}
          />
        )
      
      case 'select':
        return (
          <Select
            value={value}
            placeholder={propConfig.placeholder || `请选择${propConfig.label}`}
            onChange={(val) => handlePropChange(propName, val)}
            style={{ width: '100%' }}
            allowClear={propConfig.allowClear}
          >
            {propConfig.options?.map((option: any) => (
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
            onChange={(e) => handlePropChange(propName, e.target.value)}
          />
        )

      case 'slider':
        return (
          <Slider
            value={value}
            onChange={(val) => handlePropChange(propName, val)}
            min={propConfig.min}
            max={propConfig.max}
            step={propConfig.step}
            marks={propConfig.marks}
          />
        )

      case 'radio':
        return (
          <Radio.Group
            value={value}
            onChange={(e) => handlePropChange(propName, e.target.value)}
          >
            {propConfig.options?.map((option: any) => (
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
            onChange={(checkedValues) => handlePropChange(propName, checkedValues)}
          >
            {propConfig.options?.map((option: any) => (
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
            onChange={(color) => handlePropChange(propName, color?.toHexString())}
            showText
          />
        )
      
      default:
        return (
          <Input
            value={value}
            placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
            onChange={(e) => handlePropChange(propName, e.target.value)}
          />
        )
    }
  }

  // 根据组件类型获取特定的属性配置
  const getComponentSpecificProps = () => {
    const baseProps = {
      placeholder: {
        type: 'string',
        label: '占位符',
        defaultValue: config.props?.placeholder || '',
        placeholder: '请输入占位符文本'
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      },
      required: {
        type: 'boolean',
        label: '必填项',
        defaultValue: false
      }
    }

    // 根据组件类型添加特定属性
    switch (selectedItem.type) {
      case 'input':
      case 'password':
        return {
          ...baseProps,
          maxLength: {
            type: 'number',
            label: '最大长度',
            defaultValue: undefined,
            min: 1,
            max: 1000
          },
          allowClear: {
            type: 'boolean',
            label: '允许清空',
            defaultValue: true
          }
        }
      
      case 'number':
        return {
          ...baseProps,
          min: {
            type: 'number',
            label: '最小值',
            defaultValue: undefined
          },
          max: {
            type: 'number',
            label: '最大值',
            defaultValue: undefined
          },
          step: {
            type: 'number',
            label: '步长',
            defaultValue: 1,
            min: 0.1,
            max: 100
          },
          precision: {
            type: 'number',
            label: '精度',
            defaultValue: undefined,
            min: 0,
            max: 10
          }
        }
      
      case 'textarea':
        return {
          ...baseProps,
          rows: {
            type: 'number',
            label: '行数',
            defaultValue: 3,
            min: 1,
            max: 20
          },
          maxLength: {
            type: 'number',
            label: '最大长度',
            defaultValue: undefined,
            min: 1,
            max: 10000
          },
          showCount: {
            type: 'boolean',
            label: '显示字数统计',
            defaultValue: false
          }
        }
      
      case 'select':
        return {
          ...baseProps,
          mode: {
            type: 'select',
            label: '选择模式',
            defaultValue: undefined,
            options: [
              { label: '单选', value: undefined },
              { label: '多选', value: 'multiple' },
              { label: '标签', value: 'tags' }
            ]
          },
          allowClear: {
            type: 'boolean',
            label: '允许清空',
            defaultValue: true
          },
          showSearch: {
            type: 'boolean',
            label: '可搜索',
            defaultValue: false
          }
        }
      
      case 'switch':
        return {
          ...baseProps,
          checked: {
            type: 'boolean',
            label: '默认状态',
            defaultValue: false
          },
          size: {
            type: 'select',
            label: '尺寸',
            defaultValue: 'default',
            options: [
              { label: '默认', value: 'default' },
              { label: '小', value: 'small' }
            ]
          }
        }
      
      case 'slider':
        return {
          ...baseProps,
          min: {
            type: 'number',
            label: '最小值',
            defaultValue: 0
          },
          max: {
            type: 'number',
            label: '最大值',
            defaultValue: 100
          },
          step: {
            type: 'number',
            label: '步长',
            defaultValue: 1,
            min: 0.1,
            max: 50
          },
          defaultValue: {
            type: 'number',
            label: '默认值',
            defaultValue: 30
          },
          marks: {
            type: 'boolean',
            label: '显示刻度',
            defaultValue: false
          }
        }
      
      case 'radio':
      case 'checkbox':
        return {
          ...baseProps,
          options: {
            type: 'textarea',
            label: '选项配置',
            defaultValue: '选项1,选项2,选项3',
            placeholder: '请输入选项，用逗号分隔',
            rows: 3
          }
        }
      
      case 'date':
        return {
          ...baseProps,
          format: {
            type: 'select',
            label: '日期格式',
            defaultValue: 'YYYY-MM-DD',
            options: [
              { label: '年-月-日', value: 'YYYY-MM-DD' },
              { label: '年-月-日 时:分', value: 'YYYY-MM-DD HH:mm' },
              { label: '年-月-日 时:分:秒', value: 'YYYY-MM-DD HH:mm:ss' },
              { label: '月-日', value: 'MM-DD' }
            ]
          },
          showTime: {
            type: 'boolean',
            label: '显示时间选择',
            defaultValue: false
          }
        }
      
      default:
        return baseProps
    }
  }

  const specificProps = getComponentSpecificProps()

  return (
    <div className="componentConfig">
      <div className="config-section">
        <Divider size="small" dashed variant="dashed" style={{ borderColor: '#e9ecf0' }}>基础信息</Divider>
        <Form layout="vertical">
          <Form.Item label="标题">
            <Input
              value={selectedItem.title}
              placeholder="请输入标题"
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </Form.Item>
          {/* <Form.Item label="组件描述">
            <TextArea
              value={selectedItem.description || ''}
              placeholder="请输入组件描述"
              rows={2}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
          </Form.Item> */}
          {Object.entries(specificProps).map(([propName, propConfig]: [string, any]) => (
            <Form.Item key={propName} label={propConfig.label || propName}>
              {renderPropEditor(propName, propConfig)}
            </Form.Item>
          ))}

          {/* {
            config.propsConfig && Object.keys(config.propsConfig).length > 0 && (
              <>
                {Object.entries(config.propsConfig).map(([propName, propConfig]: [string, any]) => (
                  <Form.Item key={propName} label={propConfig.label || propName}>
                    {renderPropEditor(propName, propConfig)}
                  </Form.Item>
                ))}
              </>
            )
          } */}
        </Form>
      </div>

      <div className="config-section">
        {/* <Divider size="small" dashed variant="dashed" style={{ borderColor: '#e9ecf0' }}>正则校验</Divider> */}
      </div>
    </div>
  )
}

// 表单配置
const FormConfig: React.FC = () => {
  const { centerItems, getSelectedItem } = useFormStore()

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
            <span className="stat-value">{centerItems.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">已配置：</span>
            <span className="stat-value">
              {centerItems.filter(item => item.props && Object.keys(item.props).length > 0).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">已选中：</span>
            <span className="stat-value">
              {centerItems.filter(item => item.id === getSelectedItem()?.id).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Right: React.FC = () => {
  const [tabIndex, setTabIndex] = useState('component')

  const tabItems = [
    { key: 'component', label: '组件属性' },
    { key: 'form', label: '表单配置' },
  ]

  return (
    <div className="right">
      <Tabs
        activeKey={tabIndex}
        centered
        size="middle"
        items={tabItems}
        className="custom-tabs"
        onChange={setTabIndex}
      />
      <div className="right-board">
        {tabIndex === 'component' && <ComponentConfig />}
        {tabIndex === 'form' && <FormConfig />}
      </div>
    </div>
  )
}

export default Right
