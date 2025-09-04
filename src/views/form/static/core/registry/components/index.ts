import React from 'react'
import { Input, InputNumber, Select, Radio, Checkbox, DatePicker, Switch, Slider, Row, Col, Card } from 'antd'
import type { ComponentConfig } from '@/views/form/static/type/component'

// 默认组件配置，按类型集中管理，便于日后拆分到更细的文件
export const defaultConfigs: Record<string, ComponentConfig> = {
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
    props: { placeholder: '请输入数字', autoComplete: 'off' },
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
      // showCount: {
      //   type: 'boolean',
      //   label: '显示字数统计',
      //   defaultValue: false
      // },
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
  select: {
    component: Select,
    props: { placeholder: '请选择', style: { width: '100%' } },
    children: [
      React.createElement(Select.Option, { key: 'option1', value: 'option1', children: '选项1' }),
      React.createElement(Select.Option, { key: 'option2', value: 'option2', children: '选项2' }),
      React.createElement(Select.Option, { key: 'option3', value: 'option3', children: '选项3' })
    ],
    label: '下拉选择',
    description: '下拉选择框',
    icon: 'icon-xialaxuanze',
    category: 'select',
    tag: 'el-select',
    vmodel: 'select',
    propsConfig: {
      options: {
        type: 'string',
        label: '选项配置',
        defaultValue: '',
        placeholder: '请输入el-option的遍历数据对象字段',
      },
      placeholder: {
        type: 'string',
        label: '占位提示',
        defaultValue: '请选择',
        placeholder: '请输入占位符文本'
      },
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
      showSearch: {
        type: 'boolean',
        label: '可搜索',
        defaultValue: false
      }
    }
  },
  radio: {
    component: Radio.Group,
    children: [
      React.createElement(Radio, { key: 'option1', value: 'option1' }, '选项1'),
      React.createElement(Radio, { key: 'option2', value: 'option2' }, '选项2'),
      React.createElement(Radio, { key: 'option3', value: 'option3' }, '选项3')
    ],
    label: '单选框',
    description: '单选按钮组',
    icon: 'icon-danxuankuang-xuanzhong',
    category: 'select',
    tag: 'el-radio-group',
    vmodel: 'radio',
    propsConfig: {
      options: {
        type: 'string',
        label: '选项配置',
        defaultValue: '',
        placeholder: '请输入el-radio的遍历数据对象字段',
        rows: 3
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      },
    }
  },
  checkbox: {
    component: Checkbox.Group,
    children: [
      React.createElement(Checkbox, { key: 'option1', value: 'option1' }, '选项1'),
      React.createElement(Checkbox, { key: 'option2', value: 'option2' }, '选项2'),
      React.createElement(Checkbox, { key: 'option3', value: 'option3' }, '选项3')
    ],
    label: '复选框',
    description: '多选按钮组',
    icon: 'icon-checkbox-selected-copy',
    category: 'select',
    tag: 'el-checkbox-group',
    vmodel: 'checkbox',
    propsConfig: {
      options: {
        type: 'string',
        label: '选项配置',
        defaultValue: '',
        placeholder: '请输入el-checkbox的遍历数据对象字段',
        rows: 3
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
      // showTime: {
      //   type: 'boolean',
      //   label: '显示时间选择',
      //   defaultValue: false
      // }
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
  row: {
    component: Row,
    props: { gutter: 16 },
    label: '行布局',
    description: '水平排列组件容器',
    icon: 'icon-hangbuju',
    category: 'layout',
    tag: 'el-row',
    vmodel: 'row',
    propsConfig: {
      gutter: {
        type: 'number',
        label: '栅格间隔',
        defaultValue: 16,
        min: 0,
        max: 50
      },
      justify: {
        type: 'select',
        label: '水平排列方式',
        defaultValue: 'start',
        options: [
          { label: '左对齐', value: 'start' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '每个元素两侧的间隔相等', value: 'space-around' },
          { label: '每个元素之间的间隔相等', value: 'space-evenly' }
        ]
      },
      align: {
        type: 'select',
        label: '垂直对齐方式',
        defaultValue: 'top',
        options: [
          { label: '顶部对齐', value: 'top' },
          { label: '中间对齐', value: 'middle' },
          { label: '底部对齐', value: 'bottom' }
        ]
      }
    }
  },
  col: {
    component: Col,
    props: { span: 12 },
    label: '列布局',
    description: '在行中纵向排列内容',
    icon: 'icon-liebuju',
    category: 'layout',
    tag: 'el-col',
    vmodel: 'col',
    propsConfig: {
      span: {
        type: 'number',
        label: '栅格占位格数',
        defaultValue: 12,
        min: 1,
        max: 24
      },
      offset: {
        type: 'number',
        label: '栅格左侧的间隔格数',
        defaultValue: 0,
        min: 0,
        max: 23
      },
      push: {
        type: 'number',
        label: '栅格向右移动格数',
        defaultValue: 0,
        min: 0,
        max: 23
      },
      pull: {
        type: 'number',
        label: '栅格向左移动格数',
        defaultValue: 0,
        min: 0,
        max: 23
      },
      order: {
        type: 'number',
        label: '栅格顺序',
        defaultValue: 0,
        min: 0,
        max: 100
      }
    }
  },
  card: {
    component: Card,
    props: { title: '卡片标题' },
    label: '卡片布局',
    description: '用于包裹内容的卡片容器',
    icon: 'icon-kapianbuju',
    category: 'layout',
    tag: 'el-card',
    vmodel: 'card',
    propsConfig: {
      title: {
        type: 'string',
        label: '卡片标题',
        defaultValue: '卡片标题',
        placeholder: '请输入卡片标题'
      },
      shadow: {
        type: 'select',
        label: '阴影效果',
        defaultValue: 'always',
        options: [
          { label: '始终显示', value: 'always' },
          { label: '鼠标悬浮时显示', value: 'hover' },
          { label: '不显示', value: 'never' }
        ]
      },
    }
  },
}
