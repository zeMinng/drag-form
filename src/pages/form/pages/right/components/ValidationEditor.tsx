import { useCallback } from 'react'
import { Button, Select, Input, InputNumber, Space, Card } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ValidationRule, ValidationConfig } from '@/pages/form/static/types/component'

export interface ValidationEditorProps {
  value?: ValidationConfig
  onChange: (validation: ValidationConfig) => void
}

const EMPTY_VALIDATION: ValidationConfig = { rules: [] }

const RULE_TYPE_OPTIONS = [
  { label: '必填', value: 'required' },
  { label: '最小长度', value: 'minLength' },
  { label: '最大长度', value: 'maxLength' },
  { label: '最小值(数值)', value: 'min' },
  { label: '最大值(数值)', value: 'max' },
  { label: '邮箱格式', value: 'email' },
  { label: '手机号格式', value: 'phone' },
  { label: '正则表达式', value: 'pattern' },
  { label: '自定义', value: 'custom' },
] satisfies { label: string; value: ValidationRule['type'] }[]

const TRIGGER_OPTIONS = [
  { label: '失焦时', value: 'blur' },
  { label: '输入时', value: 'change' },
  { label: '提交时', value: 'submit' },
] satisfies { label: string; value: NonNullable<ValidationRule['trigger']> }[]

const DEFAULT_MESSAGES: Record<ValidationRule['type'], string> = {
  required: '此项为必填项',
  minLength: '长度不能少于{value}个字符',
  maxLength: '长度不能超过{value}个字符',
  min: '值不能小于{value}',
  max: '值不能大于{value}',
  email: '请输入正确的邮箱地址',
  phone: '请输入正确的手机号码',
  pattern: '格式不正确',
  custom: '校验失败',
}

const VALUE_RULE_TYPES = new Set<ValidationRule['type']>([
  'minLength',
  'maxLength',
  'min',
  'max',
  'pattern',
])

const ValidationEditor = ({ value = EMPTY_VALIDATION, onChange }: ValidationEditorProps) => {
  const { rules } = value

  const handleAddRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: '此项为必填项',
      trigger: 'blur',
    }
    onChange({
      ...value,
      rules: [...rules, newRule],
    })
  }

  const handleRemoveRule = (index: number) => {
    onChange({
      ...value,
      rules: rules.filter((_, ruleIndex) => ruleIndex !== index),
    })
  }

  const handleRuleChange = useCallback(
    <K extends keyof ValidationRule>(index: number, field: K, newValue: ValidationRule[K]) => {
      const newRules = rules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, [field]: newValue } : rule,
      )
      onChange({
        ...value,
        rules: newRules,
      })
    },
    [rules, value, onChange],
  )

  return (
    <div className="validation-editor">
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>校验规则</div>
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddRule}
          style={{ width: '100%' }}
        >
          添加校验规则
        </Button>
      </div>

      {rules.map((rule, index) => (
        <Card
          key={index}
          size="small"
          style={{ marginBottom: 8 }}
          title={`规则 ${index + 1}`}
          extra={
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveRule(index)}
            />
          }
        >
          <Space orientation="vertical" style={{ width: '100%' }}>
            <div>
              <div style={{ marginBottom: 4, fontSize: 12 }}>校验类型</div>
              <Select
                value={rule.type}
                options={RULE_TYPE_OPTIONS}
                onChange={(type: ValidationRule['type']) => {
                  const newRules = rules.map((currentRule, ruleIndex) =>
                    ruleIndex === index
                      ? { ...currentRule, type, message: DEFAULT_MESSAGES[type] }
                      : currentRule,
                  )
                  onChange({ ...value, rules: newRules })
                }}
                style={{ width: '100%' }}
              />
            </div>

            {VALUE_RULE_TYPES.has(rule.type) && (
              <div>
                <div style={{ marginBottom: 4, fontSize: 12 }}>
                  {rule.type === 'pattern' ? '正则表达式' : '校验值'}
                </div>
                {rule.type === 'pattern' ? (
                  <Input
                    value={rule.value}
                    onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                    placeholder="请输入正则表达式，如：/^[0-9]+$/"
                  />
                ) : (
                  <InputNumber
                    value={rule.value}
                    onChange={(nextValue) =>
                      handleRuleChange(index, 'value', nextValue ?? undefined)
                    }
                    style={{ width: '100%' }}
                    placeholder="请输入校验值"
                  />
                )}
              </div>
            )}

            <div>
              <div style={{ marginBottom: 4, fontSize: 12 }}>错误提示</div>
              <Input
                value={rule.message}
                onChange={(e) => handleRuleChange(index, 'message', e.target.value)}
                placeholder="请输入错误提示信息"
              />
            </div>

            <div>
              <div style={{ marginBottom: 4, fontSize: 12 }}>触发时机</div>
              <Select
                value={rule.trigger}
                onChange={(trigger) => handleRuleChange(index, 'trigger', trigger)}
                style={{ width: '100%' }}
                options={TRIGGER_OPTIONS}
              />
            </div>
          </Space>
        </Card>
      ))}

      {rules.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
          暂无校验规则，点击上方按钮添加
        </div>
      )}
    </div>
  )
}

export default ValidationEditor
