import React, { useCallback } from 'react'
import { Input, InputNumber, Select, Switch, Slider, Radio, Checkbox, ColorPicker } from 'antd'
import type { PropConfig } from '@/views/form/static/type/component'

const { TextArea } = Input
const { Option } = Select

export interface PropEditorProps {
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

export default PropEditor


