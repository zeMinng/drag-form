# 拖拽表单构建器 - 架构说明

## 概述

本项目是一个基于Vue3 + TypeScript的拖拽表单构建器，采用统一的组件注册系统来提高代码的可维护性和扩展性。

## 核心架构

### 1. 统一组件注册系统

#### 类型定义 (`src/pages/form/static/types/component.ts`)
- `ComponentCategory`: 组件分类（input、select、layout、advanced）
- `ComponentMeta`: 组件元信息（标题、描述、图标等）
- `ComponentConfig`: 组件配置（组件实例、属性配置等）
- `FormComponent`: 表单中的组件项
- `ComponentRegistry`: 组件注册器接口

#### 组件注册器 (`src/pages/form/static/registry/index.ts`)
- 统一的组件注册和管理
- 支持按分类获取组件
- 提供组件配置的增删改查
- 按分类（input / select / layout）拆分维护组件的预设配置，提高可读性与维护效率

### 2. 模块化设计

#### 左侧组件列表 (`src/views/form/pages/left/`)
- 使用统一的组件注册器获取组件列表
- 按分类展示可拖拽的组件
- 支持组件的拖拽操作

#### 中间画布区域 (`src/views/form/pages/center/`)
- 接收拖拽的组件并渲染
- 支持组件的排序和删除
- 使用统一的组件渲染器

#### 右侧配置面板 (`src/views/form/pages/right/`)
- 根据选中组件动态生成配置项
- 支持实时预览配置效果
- 统一的属性编辑器

### 3. 状态管理

#### 表单状态 (`src/store/modules/form.ts`)
- 管理画布中的组件列表
- 处理组件的选中状态
- 提供组件的增删改查操作

## 优势

### 1. 高维护性
- **统一数据源**: 所有组件配置集中在注册器中
- **类型安全**: 完整的TypeScript类型定义
- **模块解耦**: 各模块通过注册器通信，降低耦合度

### 2. 高扩展性
- **易于添加新组件**: 只需在注册器中添加配置
- **支持组件分类**: 可以轻松添加新的组件分类
- **配置化**: 组件的属性配置完全可配置

### 3. 高复用性
- **组件注册器**: 可在多个项目中复用
- **渲染工具**: 统一的组件渲染逻辑
- **类型定义**: 可复用的类型系统

## 使用示例

### 添加新组件
```typescript
import { registerComponent } from '@/pages/form/static'
import { Input } from 'antd'

registerComponent('custom-input', {
  component: Input,
  props: { placeholder: '自定义输入框' },
  label: '自定义输入框',
  description: '这是一个自定义的输入框组件',
  icon: 'icon-custom',
  category: 'input',
  propsConfig: {
    placeholder: {
      type: 'string',
      label: '占位符',
      defaultValue: '自定义输入框'
    }
  }
})
```

### 获取组件列表
```typescript
import { getComponentMetasByCategory } from '@/pages/form/static'

// 获取所有输入型组件
const inputComponents = getComponentMetasByCategory('input')
```

### 渲染组件
```typescript
import { renderComponent } from '@/pages/form/static'

const component = renderComponent({
  type: 'input',
  title: '用户名',
  props: { placeholder: '请输入用户名' }
})
```

## 文件结构

```
src/
├── store/
│   └── modules/
│       └── form.ts          # 表单状态管理
└── pages/
    └── form/
        ├── pages/           # 搭建器页面（左中右面板）
        └── static/          # 重构后的代码生成器/静态渲染器/注册中心模块
            ├── types/       # 核心类型定义
            ├── registry/    # 组件注册器与配置 (分类维护)
            ├── renderer/    # 组件运行时渲染器
            └── generator/   # 代码生成器 (Vue ElementPlus / React Antd 双轨)
```

## 迁移指南

### 从旧架构迁移
1. 删除 `src/pages/form/static/mapping/leftListMapping.ts`
2. 删除 `src/pages/form/static/formComponents/formComponents.ts`
3. 更新所有导入路径，使用新的注册器
4. 更新类型定义，使用统一的类型系统

### 注意事项
- 确保所有组件都有正确的类型定义
- 组件配置需要包含完整的属性配置
- 布局组件需要正确处理children属性 