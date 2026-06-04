import { Input, InputNumber, DatePicker, Switch, Slider } from 'antd'
import type { ComponentConfig } from '@/pages/form/static/types/component'

/**
 * 输入型组件配置
 * 包含：input, number, password, textarea, switch, date, slider
 */
export const inputConfigs: Record<string, ComponentConfig> = {
  input: {
    component: Input,
    props: { placeholder: '请输入内容', autoComplete: 'off' },
    label: '输入框',
    description: '单行文本输入',
    icon: 'icon-shurukuang',
    category: 'input',
    tag: 'el-input',
    vmodel: 'input',
    propsConfig: {
      placeholder: {
        type: 'string',
        label: '占位提示',
        defaultValue: '请输入内容',
        placeholder: '请输入占位符文本'
      },
      maxLength: {
        type: 'number',
        label: '最大长度',
        defaultValue: undefined,
        min: 1,
        max: 1000
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      },
      clearable: {
        type: 'boolean',
        label: '允许清空',
        defaultValue: undefined
      }
    }
  },
  number: {
    component: InputNumber,
    props: { placeholder: '请输入数字', autoComplete: 'off', mode: 'spinner' },
    label: '数字输入',
    description: '只允许输入数字的输入框',
    icon: 'icon-shuzishurukuang',
    category: 'input',
    tag: 'el-input-number',
    vmodel: 'number',
    propsConfig: {
      placeholder: {
        type: 'string',
        label: '占位提示',
        defaultValue: '请输入数字',
        placeholder: '请输入占位符文本'
      },
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
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      }
    }
  },
  password: {
    component: Input.Password,
    props: { placeholder: '请输入密码', autoComplete: 'new-password' },
    label: '密码输入',
    description: '密码输入框',
    icon: 'icon-mimakuang',
    category: 'input',
    tag: 'el-input',
    vmodel: 'password',
    propsConfig: {
      placeholder: {
        type: 'string',
        label: '占位提示',
        defaultValue: '请输入密码',
        placeholder: '请输入占位符文本'
      },
      maxLength: {
        type: 'number',
        label: '最大长度',
        defaultValue: undefined,
        min: 1,
        max: 1000
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      },
      clearable: {
        type: 'boolean',
        label: '允许清空',
        defaultValue: undefined
      },
    }
  },
  textarea: {
    component: Input.TextArea,
    props: { placeholder: '请输入内容', rows: 3 },
    label: '多行输入',
    description: '多行文本输入',
    icon: 'icon-duohangwenben',
    category: 'input',
    tag: 'el-input',
    vmodel: 'textarea',
    propsConfig: {
      placeholder: {
        type: 'string',
        label: '占位提示',
        defaultValue: '请输入内容',
        placeholder: '请输入占位符文本'
      },
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
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      }
    }
  },
  switch: {
    component: Switch,
    label: '开关',
    description: '开关组件',
    icon: 'icon-kaiguan',
    category: 'input',
    tag: 'el-switch',
    vmodel: 'switch',
    propsConfig: {
      size: {
        type: 'select',
        label: '尺寸',
        defaultValue: 'default',
        options: [
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      checked: {
        type: 'boolean',
        label: '默认状态',
        defaultValue: false
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      },
    }
  },
  date: {
    component: DatePicker,
    props: { style: { width: '100%' }, placeholder: '请选择日期' },
    label: '日期选择',
    description: '日期选择器',
    icon: 'icon-riqixuanze',
    category: 'input',
    tag: 'el-date-picker',
    vmodel: 'date',
    propsConfig: {
      placeholder: {
        type: 'string',
        label: '占位提示',
        defaultValue: '请选择日期',
        placeholder: '请输入占位符文本'
      },
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
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      },
    }
  },
  slider: {
    component: Slider,
    props: { defaultValue: 30 },
    label: '滑块',
    description: '滑块组件',
    icon: 'icon-huakuai',
    category: 'input',
    tag: 'el-slider',
    vmodel: 'slider',
    propsConfig: {
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
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      }
    }
  },
}
