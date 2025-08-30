# 表单构建器代码结构

## 📁 目录结构

```
static/
├── core/                    # 核心功能模块
│   ├── generator/          # 代码生成器
│   │   ├── index.ts       # 主入口
│   │   ├── script/        # 脚本生成
│   │   ├── style/         # 样式生成
│   │   └── template/      # 模板生成
│   ├── registry/          # 组件注册系统
│   │   └── componentRegistry.ts
│   └── renderer/          # 组件渲染器
│       ├── componentRenderer.tsx
│       └── componentUtils.ts
├── utils/                  # 公共工具函数
│   ├── commonUtils.ts     # 通用工具函数
│   ├── cache/             # 缓存管理
│   │   ├── cacheManager.ts
│   │   └── index.ts
│   └── props/             # 属性构建器
│       ├── formConfigBuilder.ts
│       ├── index.ts
│       └── propsBuilder.ts
├── types/                  # 类型定义
│   ├── component.ts       # 组件类型
│   ├── index.ts          # 类型导出
│   └── typeUtils.ts      # 类型工具
└── index.ts               # 主入口文件
```

## 🎯 核心功能模块

### 1. 代码生成器 (generator/)

负责将拖拽构建的表单转换为可执行的 Vue 代码。

#### 主要功能：
- **Vue 组件生成**: 将表单配置转换为 Vue 单文件组件
- **脚本生成**: 生成组件的 JavaScript/TypeScript 逻辑
- **样式生成**: 生成组件的 CSS 样式
- **模板生成**: 生成组件的 HTML 模板

#### 使用示例：
```typescript
import { generateVueComponent } from '@/views/form/static'

const vueCode = generateVueComponent(centerItems, formConfig)
```

### 2. 组件注册系统 (registry/)

管理所有可用的表单组件，提供组件的注册、查找和配置功能。

#### 主要功能：
- **组件注册**: 注册新的表单组件
- **组件查找**: 根据类型查找组件配置
- **配置管理**: 管理组件的默认属性和配置

#### 使用示例：
```typescript
import { getComponentConfig } from '@/views/form/static'

const config = getComponentConfig('input')
if (config) {
  // 使用组件配置
  const Component = config.component
  const defaultProps = config.props
}
```

### 3. 组件渲染器 (renderer/)

负责在构建器中渲染各种表单组件，处理组件的显示和交互。

#### 主要功能：
- **组件渲染**: 根据配置渲染对应的组件
- **属性合并**: 合并默认属性和自定义属性
- **事件处理**: 处理组件的各种交互事件

#### 使用示例：
```typescript
import { ComponentWrapper } from '@/views/form/static'

// 包装未知组件类型
<ComponentWrapper title="未知组件">
  <div>组件内容</div>
</ComponentWrapper>
```

## 🛠️ 工具函数模块

### 1. 公共工具 (utils/commonUtils.ts)

提供项目中常用的工具函数和常量。

#### 主要功能：
- **拖拽常量**: 拖拽相关的配置常量
- **组件类型**: 组件类型的分类常量
- **样式常量**: 常用的样式配置
- **工具函数**: ID生成、JSON验证、属性过滤等

#### 使用示例：
```typescript
import { DRAG_CONSTANTS, COMPONENT_TYPES, utils } from '@/views/form/static/utils/commonUtils'

// 使用拖拽常量
const distance = DRAG_CONSTANTS.ACTIVATION_DISTANCE

// 使用组件类型
if (COMPONENT_TYPES.LAYOUT.includes(componentType)) {
  // 处理布局组件
}

// 使用工具函数
const newId = utils.generateId('component')
const isValid = utils.validateJSONData(jsonData)
```

### 2. 缓存管理 (utils/cache/)

管理组件的缓存，提高渲染性能。

#### 主要功能：
- **组件缓存**: 缓存已渲染的组件
- **缓存清理**: 清理过期的缓存
- **性能优化**: 避免重复渲染相同组件

### 3. 属性构建器 (utils/props/)

构建和管理组件的属性配置。

#### 主要功能：
- **属性合并**: 合并默认属性和用户配置
- **属性验证**: 验证属性的有效性
- **属性转换**: 转换属性格式

## 📋 类型定义

### 1. 组件类型 (types/component.ts)

定义表单组件的核心类型。

```typescript
interface ComponentConfig {
  component: React.ComponentType<any>
  props: Record<string, any>
  children?: React.ReactNode
  title?: string
  description?: string
  icon?: string
}
```

### 2. 类型工具 (types/typeUtils.ts)

提供类型相关的工具函数。

#### 主要功能：
- **类型检查**: 检查对象的类型
- **类型转换**: 安全的类型转换
- **类型验证**: 验证类型定义

## 🚀 扩展指南

### 添加新组件

1. **注册组件**:
```typescript
// 在 componentRegistry.ts 中注册
registerComponent('custom-input', {
  component: CustomInput,
  props: { placeholder: '请输入...' },
  title: '自定义输入框',
  description: '一个自定义的输入组件'
})
```

2. **实现渲染逻辑**:
```typescript
// 在 componentRenderer.tsx 中添加渲染逻辑
if (item.type === 'custom-input') {
  return <CustomInput {...mergedProps} />
}
```

3. **添加到组件库**:
```typescript
// 在左侧组件库中添加组件项
{
  type: 'component',
  key: 'custom-input',
  title: '自定义输入框',
  description: '一个自定义的输入组件',
  icon: 'icon-input'
}
```

### 自定义代码生成

1. **扩展生成器**:
```typescript
// 在 generator/ 中添加新的生成逻辑
export const generateCustomComponent = (items: CenterItem[], config: FormConfig) => {
  // 自定义生成逻辑
}
```

2. **添加导出格式**:
```typescript
// 支持更多框架的代码导出
export const generateReactComponent = (items: CenterItem[], config: FormConfig) => {
  // React 组件生成逻辑
}
```

## 🔧 性能优化

### 1. 组件缓存
- 使用 `React.memo` 包装组件
- 实现组件级别的缓存策略
- 避免不必要的重渲染

### 2. 属性优化
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 优化事件处理函数
- 合理使用依赖数组

### 3. 渲染优化
- 虚拟化长列表
- 懒加载非关键组件
- 优化拖拽性能

## 📚 最佳实践

### 1. 组件设计
- 保持组件的单一职责
- 使用 TypeScript 严格模式
- 提供完整的类型定义

### 2. 性能考虑
- 避免在渲染函数中创建对象
- 合理使用 React.memo
- 优化依赖数组

### 3. 代码质量
- 遵循 ESLint 规则
- 编写单元测试
- 保持代码注释完整

## 🐛 常见问题

### Q: 如何调试组件渲染问题？
A: 使用 React DevTools 检查组件树和属性，查看控制台错误信息。

### Q: 如何优化拖拽性能？
A: 使用 `useCallback` 包装拖拽事件处理函数，避免不必要的重渲染。

### Q: 如何添加新的组件类型？
A: 在组件注册系统中注册新组件，在渲染器中添加对应的渲染逻辑。

---

这个架构设计确保了代码的可维护性、可扩展性和性能，同时保持了清晰的模块划分和职责分离。
