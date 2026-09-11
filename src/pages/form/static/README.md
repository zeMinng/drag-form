# 表单构建器代码结构

## 目录结构

```text
src/pages/form/static/
├── index.ts                         # 根目录统一导出（对外 API）
│
├── types/                           # 📌 类型定义
│   └── component.ts                 # ComponentMeta, ComponentConfig, PropConfig...
│
├── registry/                        # 📌 组件注册管理
│   ├── index.ts                     # 导出 componentRegistry + 便捷方法
│   └── components/                  # 组件配置定义（按分类拆分）
│       ├── index.ts                 # 聚合所有分类组件配置
│       ├── input.ts                 # 输入型：input, number, password, textarea, switch, date, slider
│       ├── select.ts                # 选择型：select, cascader, radio, checkbox
│       └── layout.ts                # 布局型：row, col, card
│
├── renderer/                        # 📌 组件运行时渲染
│   ├── componentRenderer.tsx        # ComponentWrapper 渲染包装器
│   └── componentUtils.ts            # 运行时渲染工具函数 (renderComponentByType等)
│
└── generator/                       # 📌 代码生成器（构建时）
    ├── index.ts                     # 统一导出 generateVueComponent + generateReactComponent
    ├── shared/                      # Vue / React 共享生成逻辑
    │   ├── cache.ts                 # 代码缓存管理
    │   ├── typeMapping.ts           # TS类型映射与默认值处理
    │   └── validation.ts            # 通用校验规则解析
    │
    ├── vue/                         # Vue + Element Plus 生成器
    │   ├── index.ts                 # Vue 生成器入口
    │   ├── template.ts              # template 模板代码生成
    │   ├── script.ts                # script 脚本代码生成 (Composition API)
    │   ├── style.ts                 # style 样式代码生成
    │   ├── propsMapper.ts           # Antd 属性到 Element Plus 的属性名映射
    │   ├── propsBuilder.ts          # Vue 属性字符串序列化
    │   └── formConfig.ts            # 表单级别配置生成
    │
    └── react/                       # React + Ant Design 生成器
        ├── index.ts                 # React 生成器入口
        ├── jsx.ts                   # JSX 代码生成
        ├── antdMeta.ts              # Antd 标签/Import 元信息
        ├── propsBuilder.ts          # React 属性序列化
        └── rules.ts                 # Form 校验规则代码生成
```

## 模块说明

### 1. 类型定义 (`types/`)
- `component.ts`: 定义了整个表单构建器运行时与构建时所需的核心 TypeScript 类型，包括组件分类 `ComponentCategory`、组件元信息 `ComponentMeta`、属性配置类型 `PropConfig`、校验规则类型 `ValidationRule` 等。

### 2. 组件注册器 (`registry/`)
- 管理所有在编辑器左侧面板可供拖拽的组件。
- 采用分类拆分设计（`input.ts` / `select.ts` / `layout.ts`），方便维护及扩展新组件。
- 提供统一实例 `componentRegistry` 以及全局辅助方法如 `getComponentConfig(type)`、`getComponentMetasByCategory(category)`。

### 3. 运行时渲染器 (`renderer/`)
- **componentRenderer.tsx**: 提供画布中组件的包装（`ComponentWrapper`），负责处理选中、删除、排序等编辑交互的外观效果。
- **componentUtils.ts**: 根据组件的实时属性与表单级配置（如禁用状态、尺寸等），在 React 运行时渲染出对应的 Antd 交互式组件。

### 4. 代码生成器 (`generator/`)
- 包含面向构建时的代码序列化生成逻辑。
- **shared/**: 提取了 Vue 和 React 代码生成时共用的缓存机制、TS 类型映射、基本校验规则定义。
- **vue/**: 整合 Template、Script (TypeScript + Composition API)、Style，生成可以直接运行的 `.vue` 单文件组件代码。
- **react/**: 生成基于 React + TSX + Ant Design 的表单页面代码。

## 使用方式

### 导入方式

所有供外部使用的核心方法和类型都已在 `static/index.ts` 根入口聚合：

```typescript
// 导入核心方法
import { 
  generateVueComponent, 
  generateReactComponent, 
  getComponentConfig, 
  renderComponentByType 
} from '@/pages/form/static'

// 导入类型定义
import type { ComponentMeta, FormComponent } from '@/pages/form/static'
```

### 主要 API

- `generateVueComponent(items, formConfig)`: 生成完整的 Vue 3 + TS + Element Plus 代码。
- `generateReactComponent(items, formConfig)`: 生成完整的 React + TSX + Ant Design 代码。
- `renderComponentByType(item, formConfig)`: 运行时渲染出对应的画布组件。
- `getComponentConfig(type)`: 获取某个组件类型的注册配置和属性选项。

## 设计原则

1. **职责分离**: 运行时渲染 (registry & renderer) 与构建时生成 (generator) 彻底解耦，结构清晰。
2. **结构对称**: Vue 和 React 的生成器在结构 and 命名上高度对称，方便对比和统一迭代。
3. **高扩展性**: 新增组件仅需在 `registry/components/` 下的对应分类中加入配置，无需修改主逻辑。
4. **共享复用**: 将公共的类型、缓存及规则库移至 `shared/`，减少逻辑重复度。
5. **开箱即用**: 提供统一的顶层出口，避免外部文件因内部目录重构而进行大面积的 import 路径改动。
