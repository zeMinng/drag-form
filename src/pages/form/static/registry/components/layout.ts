import { Row, Col, Card } from 'antd'
import type { ComponentConfig } from '@/pages/form/static/types/component'

/**
 * 布局型组件配置
 * 包含：row, col, card
 */
export const layoutConfigs: Record<string, ComponentConfig> = {
  row: {
    component: Row,
    props: { gutter: 0 },
    label: '行布局',
    description: '水平排列组件容器',
    icon: 'icon-hangbuju',
    category: 'layout',
    tag: 'el-row',
    vmodel: 'row',
    propsConfig: {
      gutter: {
        type: 'slider-input',
        label: '栅格间隔',
        defaultValue: 0,
        min: 0,
        max: 50,
        step: 1,
        marks: true
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
    props: {},
    label: '列布局',
    description: '在行中纵向排列内容',
    icon: 'icon-liebuju',
    category: 'layout',
    tag: 'el-col',
    vmodel: 'col',
    propsConfig: {
      span: {
        type: 'slider-input',
        label: '栅格占位格数',
        defaultValue: 24,
        min: 1,
        max: 24,
        step: 1,
        marks: true
      },
      responsive: {
        type: 'responsive-span',
        label: '响应式栅格',
        defaultValue: {}
      },
      offset: {
        type: 'slider-input',
        label: '栅格左侧的间隔格数',
        defaultValue: 0,
        min: 0,
        max: 23,
        step: 1
      },
      push: {
        type: 'slider-input',
        label: '栅格向右移动格数',
        defaultValue: 0,
        min: 0,
        max: 23,
        step: 1
      },
      pull: {
        type: 'slider-input',
        label: '栅格向左移动格数',
        defaultValue: 0,
        min: 0,
        max: 23,
        step: 1
      },
      order: {
        type: 'slider-input',
        label: '栅格顺序',
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 1
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
