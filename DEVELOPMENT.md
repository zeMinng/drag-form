# Drag Vue Form 项目开发文档

## 🎯 项目概述
这是一个基于 React + TypeScript + Ant Design 的拖拽式表单构建器，可以拖拽组件到画布上，配置组件属性，最终生成 Vue 3 + Element Plus 的代码。

---

## 🏗️ 项目架构

### 目录结构
```
src/
├── components/          # 通用组件
├── hooks/              # 自定义 Hooks
├── layout/             # 布局组件
├── router/             # 路由配置
├── store/              # 状态管理
├── styles/             # 样式文件
├── types/              # 类型定义
├── views/              # 页面组件
│   └── form/          # 表单构建器相关
│       ├── components/ # 表单构建器专用组件
│       ├── pages/      # 三个主要页面
│       └── static/     # 静态资源和核心逻辑
└── utils/              # 工具函数
```

---

## 🚀 核心功能模块

### 1. 拖拽系统 (Drag & Drop)
- **技术栈**: `@dnd-kit/core` + `@dnd-kit/sortable`
- **主要功能**: 组件拖拽、排序、插入指示器
- **核心文件**: 
  - `src/views/form/pages/left/index.tsx` - 拖拽源
  - `src/views/form/pages/center/index.tsx` - 拖拽目标
  - `src/hooks/useDragAndDrop.ts` - 拖拽逻辑

### 2. 状态管理 (State Management)
- **技术栈**: Zustand + 持久化存储
- **核心文件**: `src/store/modules/form.ts`
- **主要状态**:
  ```typescript
  interface FormStore {
    centerItems: CenterItem[]        // 画布上的组件
    selectedItemId: string | null    // 当前选中的组件ID
    formConfig: FormConfig          // 表单级别配置
  }
  ```

### 3. 组件系统 (Component System)
- **核心文件**: `src/views/form/static/`
- **组件注册**: `src/views/form/static/registry/componentRegistry.ts`
- **组件渲染**: `src/views/form/static/renderer/componentRenderer.tsx`
- **组件配置**: `src/views/form/static/type/component.ts`

---

## 📁 详细文件说明

### A. 页面组件 (Pages)

#### 1. 左侧组件列表 (`src/views/form/pages/left/index.tsx`)
```typescript
// 主要功能：显示可拖拽的组件列表
const Left: React.FC = () => {
  // 组件分类：输入型、选择型、布局型
  const [selectedType, setSelectedType] = useState<ComponentCategory>('input')
  
  // 获取对应分类的组件元数据
  const data = useMemo(() => getComponentMetasByCategory(selectedType), [selectedType])
}
```

**关键函数**:
- `getComponentMetasByCategory()`: 根据分类获取组件列表
- `DraggableListItem`: 可拖拽的组件项，使用 `useDraggable` hook

#### 2. 中央画布 (`src/views/form/pages/center/index.tsx`)
```typescript
// 主要功能：接收拖拽的组件，显示表单预览
const Center: React.FC<CenterProps> = ({ insertIndex, isDraggingOver }) => {
  // 启用键盘快捷键
  useKeyboardShortcuts()
  
  // 渲染画布内容
  return (
    <div className='centerWrap'>
      <CenterTop />           {/* 工具栏 */}
      <ErrorBoundary>         {/* 错误边界 */}
        <div className="center-container"> {/* 拖拽目标区域 */}
          {/* 表单组件列表 */}
        </div>
      </ErrorBoundary>
    </div>
  )
}
```

**关键组件**:
- `CenterTop`: 顶部工具栏（清空、预览代码、编辑JSON等）
- `FormWrapper`: 表单包装器，应用表单级别配置
- `SortableItem`: 可排序的表单组件项
- `InsertIndicator`: 插入位置指示器

#### 3. 右侧属性配置 (`src/views/form/pages/right/index.tsx`)
```typescript
// 主要功能：配置选中组件的属性和表单设置
const Right: React.FC = () => {
  const [tabIndex, setTabIndex] = useState('component')
  
  // 两个标签页：组件属性、表单配置
  const tabItems = [
    { key: 'component', label: '组件属性' },
    { key: 'form', label: '表单配置' }
  ]
}
```

**关键组件**:
- `PropEditor`: 属性编辑器，根据属性类型渲染对应的输入组件
- `ComponentConfig`: 组件属性配置面板
- `FormConfig`: 表单级别配置面板

**属性编辑器优化**:
```typescript
// 使用组件映射替代大量 switch 语句
const EDITOR_COMPONENTS = {
  string: ({ value, placeholder, onChange }) => <Input ... />,
  number: ({ value, placeholder, onChange, min, max, step }) => <InputNumber ... />,
  boolean: ({ value, onChange }) => <Switch ... />,
  // ... 其他类型
}
```

### B. 核心逻辑 (Static)

#### 1. 组件注册器 (`src/views/form/static/registry/componentRegistry.ts`)
```typescript
// 管理所有可用组件的注册信息
export const componentRegistry = new Map<string, ComponentMeta>()

// 注册组件
export function registerComponent(meta: ComponentMeta) {
  componentRegistry.set(meta.key, meta)
}

// 获取组件配置
export function getComponentConfig(type: string): ComponentConfig | null {
  // 根据组件类型返回配置信息
}
```

#### 2. 代码生成器 (`src/views/form/static/core/generator/index.ts`)
```typescript
// 核心功能：将表单配置转换为 Vue 3 代码
export function generateVueComponent(
  centerItems: CenterItem[], 
  formConfig: FormConfig
): string {
  // 1. 生成模板代码
  const template = generateTemplate(centerItems, formConfig)
  
  // 2. 生成脚本代码
  const script = generateScript(centerItems, formConfig)
  
  // 3. 生成样式代码
  const style = generateStyle(formConfig)
  
  return `${template}\n\n${script}\n\n${style}`
}
```

**生成的文件结构**:
- `template`: Vue 模板，包含表单结构和组件
- `script`: Vue 3 Composition API 脚本
- `style`: CSS 样式，支持表单配置

#### 3. 组件渲染器 (`src/views/form/static/renderer/componentRenderer.tsx`)
```typescript
// 负责在画布上渲染各种类型的组件
export function renderComponent(
  item: CenterItem, 
  formConfig: FormConfig
): React.ReactElement {
  const config = getComponentConfig(item.type)
  
  // 合并默认属性和自定义属性
  const mergedProps = { ...config.props, ...item.props }
  
  // 根据组件类型进行特殊处理
  if (isOptionComponent(item.type)) {
    return renderOptionComponent(item, mergedProps)
  }
  
  return <Component {...mergedProps} />
}
```

### C. 自定义 Hooks

#### 1. 键盘快捷键 (`src/hooks/useKeyboardShortcuts.ts`)
```typescript
export const useKeyboardShortcuts = () => {
  const { removeCenterItem, getSelectedItem } = useFormStore()
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Delete: 删除选中组件
    if (e.key === 'Delete') {
      const selectedItem = getSelectedItem()
      if (selectedItem) {
        removeCenterItem(selectedItem.id)
      }
    }
    
    // 预留其他快捷键接口
    // Ctrl+Z: 撤销, Ctrl+Y: 重做, Ctrl+C: 复制, Ctrl+V: 粘贴
  }, [removeCenterItem, getSelectedItem])
}
```

#### 2. 剪贴板操作 (`src/hooks/useClipboard.ts`)
```typescript
export const useClipboard = () => {
  const copyText = useCallback(async (
    text: string, 
    element?: HTMLElement,
    successMessage?: string,
    fallbackMessage?: string
  ) => {
    try {
      // 优先使用现代 Clipboard API
      await navigator.clipboard.writeText(text)
      message.success(successMessage || '复制成功')
    } catch {
      // 降级到传统方法
      fallbackCopy(element, text, fallbackMessage)
    }
  }, [])
  
  return { copyText }
}
```

### D. 状态管理 (Store)

#### 表单状态管理 (`src/store/modules/form.ts`)
```typescript
interface FormStore {
  // 画布组件
  centerItems: CenterItem[]
  selectedItemId: string | null
  
  // 表单配置
  formConfig: FormConfig
  
  // 操作方法
  addCenterItem: (item: Omit<CenterItem, 'id'>) => void
  updateCenterItem: (id: string, updates: Partial<CenterItem>) => void
  removeCenterItem: (id: string) => void
  setSelectedItemId: (id: string | null) => void
  updateFormConfig: (updates: Partial<FormConfig>) => void
  resetFormConfig: () => void
}

// 使用 Zustand 创建持久化存储
export const useFormStore = createPersistedStore<FormStore>(
  'form-store',
  (set, get) => ({
    // 初始状态
    centerItems: [],
    selectedItemId: null,
    formConfig: defaultFormConfig,
    
    // 操作方法实现
    addCenterItem: (item) => { /* 实现逻辑 */ },
    updateCenterItem: (id, updates) => { /* 实现逻辑 */ },
    // ... 其他方法
  })
)
```

---

## 🎨 UI 组件系统

### Ant Design 组件使用
- **布局**: `Tabs`, `Form`, `Divider`, `Space`
- **输入**: `Input`, `InputNumber`, `Select`, `Switch`, `ColorPicker`
- **选择**: `Radio`, `Checkbox`, `Slider`
- **反馈**: `Modal`, `Drawer`, `message`
- **数据展示**: `List`, `Empty`

### 自定义组件
- **IconFont**: 图标字体组件
- **ErrorBoundary**: 错误边界组件
- **ComponentWrapper**: 组件包装器
- **InsertIndicator**: 插入位置指示器

---

## 🔄 数据流

### 1. 组件拖拽流程
```
左侧组件列表 → 拖拽 → 中央画布 → 添加到 centerItems → 重新渲染
```

### 2. 属性配置流程
```
选中组件 → 更新 selectedItemId → 右侧面板显示 → 修改属性 → 更新 centerItems → 重新渲染
```

### 3. 代码生成流程
```
centerItems + formConfig → 代码生成器 → Vue 3 代码 → 预览/下载
```

---

## 🛠️ 开发指南

### 添加新组件类型
1. **在 `componentRegistry.ts` 中注册组件元数据**
2. **在 `componentRenderer.tsx` 中添加渲染逻辑**
3. **在 `generator` 中添加代码生成逻辑**
4. **更新类型定义**

### 修改组件属性
1. **在 `component.ts` 中更新 `PropConfig` 类型**
2. **在 `PropEditor` 中添加对应的编辑器组件**
3. **更新组件配置中的默认值**

### 添加新的表单配置
1. **在 `form.ts` 中扩展 `FormConfig` 接口**
2. **在 `FormConfig` 组件中添加配置项**
3. **在代码生成器中应用新配置**

---

## 🐛 错误处理

### ErrorBoundary 组件
```typescript
// 捕获组件树中的 JavaScript 错误
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('组件错误:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackUI onRetry={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}
```

---

## 📱 响应式设计

### 布局适配
- **左侧**: 固定宽度，组件列表
- **中央**: 自适应宽度，画布区域
- **右侧**: 固定宽度，配置面板

### 拖拽体验
- **拖拽预览**: 半透明效果
- **插入指示器**: 位置提示
- **键盘支持**: 删除、选择等快捷键

---

## 🔧 性能优化

### React 优化
- **React.memo**: 防止不必要的重渲染
- **useMemo**: 缓存计算结果
- **useCallback**: 缓存函数引用

### 状态管理优化
- **Zustand**: 轻量级状态管理
- **持久化存储**: 自动保存用户配置
- **选择性更新**: 只更新必要的状态

---

## 📦 构建和部署

### 开发环境
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

### 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 库**: Ant Design
- **状态管理**: Zustand
- **拖拽库**: @dnd-kit
- **代码高亮**: Prism.js

---

## 🚀 未来扩展方向

### 功能增强
- **撤销/重做**: 操作历史管理
- **组件模板**: 预设组件组合
- **表单验证**: 规则配置和验证
- **主题定制**: 样式主题系统

### 技术优化
- **虚拟滚动**: 大量组件的性能优化
- **拖拽预览**: 更流畅的拖拽体验
- **代码格式化**: 生成的代码美化
- **类型安全**: 更严格的 TypeScript 类型

---

## 📝 总结

这个项目是一个功能完整的拖拽式表单构建器，采用了现代化的技术栈和架构设计。通过模块化的代码组织、完善的类型定义和优秀的用户体验，为开发者提供了一个强大而灵活的表单构建工具。

### 主要特点
- ✅ **模块化架构**: 清晰的代码组织和职责分离
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **性能优化**: React 最佳实践和状态管理优化
- ✅ **用户体验**: 流畅的拖拽操作和直观的配置界面
- ✅ **错误处理**: 完善的错误边界和用户反馈
- ✅ **扩展性**: 易于添加新组件和功能

### 快速开始
1. 克隆项目并安装依赖
2. 运行开发服务器
3. 拖拽组件到画布
4. 配置组件属性
5. 生成 Vue 代码

如果您有任何具体的开发问题或需要深入了解某个模块，请参考相关代码注释或联系开发团队！
