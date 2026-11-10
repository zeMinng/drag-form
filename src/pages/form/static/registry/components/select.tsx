import React from 'react'
import { Select, Cascader, Radio, Checkbox } from 'antd'
import type { ComponentConfig } from '@/pages/form/static/types/component'

/**
 * 选择型组件配置
 * 包含：select, cascader, radio, checkbox
 */
export const selectConfigs: Record<string, ComponentConfig> = {
  select: {
    component: Select,
    props: { placeholder: '请选择', style: { width: '100%' } },
    children: [
      <Select.Option key="option1" value="option1">选项1</Select.Option>,
      <Select.Option key="option2" value="option2">选项2</Select.Option>,
      <Select.Option key="option3" value="option3">选项3</Select.Option>,
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
  cascader: {
    component: Cascader,
    props: { placeholder: '请选择', style: { width: '100%' } },
    label: '级联选择',
    description: '级联选择框',
    icon: 'icon-jilianxuanze',
    category: 'select',
    tag: 'el-cascader',
    vmodel: 'cascader',
    propsConfig: {
      options: {
        type: 'string',
        label: '选项配置',
        defaultValue: '',
        isParam: true,
        placeholder: '请输入el-cascader的遍历数据对象字段',
      },
      placeholder: {
        type: 'string',
        label: '占位提示',
        defaultValue: '请选择',
        placeholder: '请输入占位符文本'
      },
      disabled: {
        type: 'boolean',
        label: '禁用状态',
        defaultValue: false
      },
      clearable: {
        type: 'boolean',
        label: '允许清空',
        defaultValue: true
      },
      showAllLevels: {
        type: 'boolean',
        label: '显示完整路径',
        defaultValue: true
      },
      filterable: {
        type: 'boolean',
        label: '可搜索',
        defaultValue: false
      },
      multiple: {
        type: 'boolean',
        label: '是否多选',
        defaultValue: false
      },
      checkStrictly: {
        type: 'boolean',
        label: '任意级可选',
        defaultValue: false
      },
      emitPath: {
        type: 'boolean',
        label: '返回完整路径',
        defaultValue: true
      },
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
}
