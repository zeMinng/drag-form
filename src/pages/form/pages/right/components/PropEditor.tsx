import {
  Input,
  InputNumber,
  Select,
  Switch,
  Slider,
  Radio,
  Checkbox,
  ColorPicker,
  Row,
  Col,
} from 'antd'
import type { PropConfig, PropValueType } from '@/pages/form/static/types/component'

const { TextArea } = Input
export interface PropEditorProps {
  propName: string
  propConfig: PropConfig
  value: PropValueType
  onChange: (propName: string, value: PropValueType) => void
}

export default function PropEditor({ propName, propConfig, value, onChange }: PropEditorProps) {
  const handleChange = (newValue: PropValueType) => onChange(propName, newValue)
  const responsiveValue =
    typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {}
  const textValue = typeof value === 'string' ? value : undefined
  const numericValue = typeof value === 'number' ? value : undefined
  const optionValue = typeof value === 'string' || typeof value === 'number' ? value : undefined
  const arrayValue = Array.isArray(value)
    ? value.filter((item): item is string | number | boolean =>
        ['string', 'number', 'boolean'].includes(typeof item),
      )
    : undefined
  switch (propConfig.type) {
    case 'string':
      return (
        <Input
          value={textValue}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          onChange={(e) => handleChange(e.target.value)}
        />
      )

    case 'number':
      return (
        <InputNumber
          value={numericValue}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          onChange={(nextValue) => handleChange(nextValue ?? undefined)}
          style={{ width: '100%' }}
          min={propConfig.min}
          max={propConfig.max}
          step={propConfig.step}
          mode="spinner"
        />
      )

    case 'boolean':
      return <Switch checked={value === true} onChange={handleChange} />

    case 'select':
      return (
        <Select
          value={optionValue}
          placeholder={propConfig.placeholder || `请选择${propConfig.label}`}
          onChange={handleChange}
          style={{ width: '100%' }}
          allowClear={propConfig.allowClear}
          options={propConfig.options?.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
        />
      )

    case 'textarea':
      return (
        <TextArea
          value={textValue}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          rows={propConfig.rows || 3}
          onChange={(e) => handleChange(e.target.value)}
        />
      )

    case 'slider':
      return (
        <Slider
          value={numericValue}
          onChange={handleChange}
          min={propConfig.min}
          max={propConfig.max}
          step={propConfig.step}
          marks={
            propConfig.marks
              ? { [propConfig.min || 0]: propConfig.min, [propConfig.max || 100]: propConfig.max }
              : undefined
          }
        />
      )

    case 'radio':
      return (
        <Radio.Group value={optionValue} onChange={(e) => handleChange(e.target.value)}>
          {propConfig.options?.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      )

    case 'checkbox':
      return (
        <Checkbox.Group value={arrayValue} onChange={handleChange}>
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
          value={textValue}
          onChange={(color) => handleChange(color?.toHexString())}
          showText
        />
      )

    case 'slider-input':
      return (
        <div>
          <Slider
            value={numericValue}
            onChange={handleChange}
            min={propConfig.min || 0}
            max={propConfig.max || 100}
            step={propConfig.step || 1}
            marks={
              propConfig.marks
                ? {
                    [propConfig.min || 0]: propConfig.min,
                    [propConfig.max || 100]: propConfig.max,
                  }
                : undefined
            }
            style={{ marginBottom: 8 }}
          />
          {/* <InputNumber
            value={value}
            onChange={handleChange}
            min={propConfig.min || 0}
            max={propConfig.max || 100}
            step={propConfig.step || 1}
            style={{ width: '100%' }}
          /> */}
        </div>
      )

    case 'responsive-span':
      return (
        <div>
          <Row gutter={[8, 8]}>
            {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((breakpoint) => (
              <Col span={8} key={breakpoint}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>{breakpoint.toUpperCase()}</div>
                <InputNumber
                  value={responsiveValue[breakpoint] as number | undefined}
                  onChange={(val) => {
                    const newValue = { ...responsiveValue, [breakpoint]: val ?? undefined }
                    handleChange(newValue)
                  }}
                  min={1}
                  max={24}
                  placeholder="span"
                  style={{ width: '100%' }}
                />
              </Col>
            ))}
          </Row>
        </div>
      )

    default:
      return (
        <Input
          value={textValue}
          placeholder={propConfig.placeholder || `请输入${propConfig.label}`}
          onChange={(e) => handleChange(e.target.value)}
        />
      )
  }
}
