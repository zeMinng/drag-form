# 表单构建器代码结构

## 目录结构

```
src/views/form/static/
├── core/                    # 核心功能模块
│   ├── generator/          # 代码生成器
│   │   ├── template/       # 模板生成器
│   │   │   └── index.ts    # Vue模板生成
│   │   ├── script/         # 脚本生成器
│   │   │   └── index.ts    # Vue脚本生成
│   │   ├── style/          # 样式生成器
│   │   │   └── index.ts    # CSS样式生成
│   │   └── index.ts        # 生成器主入口
│   ├── registry/           # 组件注册管理
│   │   └── componentRegistry.ts
│   ├── renderer/           # 组件渲染
│   │   ├── componentRenderer.tsx
│   │   └── componentUtils.ts
│   └── index.ts            # 核心功能统一导出
├── utils/                   # 通用工具模块
│   ├── cache/              # 缓存管理
│   │   ├── cacheManager.ts
│   │   └── index.ts
│   ├── props/              # 属性处理
│   │   ├── propsBuilder.ts
│   │   ├── formConfigBuilder.ts
│   │   └── index.ts
│   ├── types/              # 类型工具
│   │   ├── typeUtils.ts
│   │   └── index.ts
│   └── index.ts            # 工具统一导出
├── types/                   # 类型定义
│   └── component.ts
├── index.ts                 # 根目录统一导出
└── README.md               # 本文档
```

## 模块说明

### 核心功能 (core/)

#### 代码生成器 (generator/)
- **template/**: 负责生成Vue组件的template部分
- **script/**: 负责生成Vue组件的script部分（TypeScript + Composition API）
- **style/**: 负责生成Vue组件的CSS样式
- **index.ts**: 整合所有生成器，生成完整的Vue组件代码

#### 组件注册器 (registry/)
- 管理所有可用组件的配置信息
- 提供组件注册、查询、更新等功能

#### 组件渲染器 (renderer/)
- 负责在拖拽界面中渲染组件
- 提供组件渲染相关的工具函数

### 工具模块 (utils/)

#### 缓存管理 (cache/)
- 代码生成结果的缓存管理
- 避免重复计算，提高性能

#### 属性处理 (props/)
- 组件属性的构建和格式化
- 表单配置的构建和转换

#### 类型工具 (types/)
- TypeScript类型相关的工具函数
- 组件类型到TypeScript类型的映射

### 类型定义 (types/)
- 所有相关的TypeScript接口和类型定义

## 使用方式

### 导入方式

```typescript
// 导入所有功能
import { generateVueComponent, getComponentConfig } from '@/views/form/static'

// 或者按需导入
import { generateVueComponent } from '@/views/form/static/core/generator'
import { buildPropsString } from '@/views/form/static/utils/props'
```

### 主要API

- `generateVueComponent(items, formConfig)`: 生成完整的Vue组件代码
- `generateVueTemplate(items, formConfig)`: 生成Vue模板代码
- `generateVueScript(items, formConfig)`: 生成Vue脚本代码
- `generateVueStyle()`: 生成CSS样式代码
- `getComponentConfig(type)`: 获取组件配置
- `buildPropsString(props)`: 构建属性字符串

## 设计原则

1. **模块化**: 每个功能模块职责单一，便于维护和测试
2. **可扩展**: 新增组件类型或生成器时，只需在对应模块中添加
3. **向后兼容**: 保持原有API的兼容性
4. **性能优化**: 使用缓存机制避免重复计算
5. **类型安全**: 完整的TypeScript类型支持
