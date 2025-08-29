# 拖拽表单构建器 (drag-vue-form)

一个基于 React + TypeScript 的现代化拖拽表单构建器，支持可视化拖拽创建表单，并导出 Vue 组件代码。

## ✨ 主要特性

- 🖱️ **可视化拖拽**: 直观的拖拽界面，轻松创建复杂表单
- 🧩 **组件丰富**: 内置多种表单组件（输入框、选择器、布局组件等）
- 🎨 **实时预览**: 拖拽过程中实时预览表单效果
- 📱 **响应式设计**: 支持多种屏幕尺寸和布局
- 🔧 **灵活配置**: 支持表单级别和组件级别的属性配置
- 📤 **代码导出**: 一键导出 Vue 组件代码
- 💾 **JSON 编辑**: 支持直接编辑 JSON 数据
- 🚀 **高性能**: 使用 React 18 + TypeScript，性能优异

## 🏗️ 项目架构

```
src/
├── components/          # 通用组件
│   └── Icon/           # 图标组件
├── hooks/              # 自定义 Hooks
│   ├── useDragAndDrop.ts    # 拖拽状态管理
│   └── useClipboard.ts      # 剪贴板操作
├── layout/             # 布局组件
│   ├── Menu.tsx        # 侧边菜单
│   └── ToolHeader.tsx  # 顶部工具栏
├── store/              # 状态管理
│   ├── modules/        # 状态模块
│   │   └── form.ts     # 表单状态
│   └── type/           # 类型定义
├── views/              # 页面组件
│   └── form/           # 表单构建器
│       ├── components/ # 可复用组件
│       │   ├── DragOverlayItem.tsx    # 拖拽覆盖层
│       │   ├── InsertIndicator.tsx    # 插入指示器
│       │   └── ToolbarConfig.tsx      # 工具栏配置
│       ├── pages/      # 页面组件
│       │   ├── center/ # 中间画布
│       │   ├── left/   # 左侧组件库
│       │   └── right/  # 右侧属性面板
│       ├── static/     # 静态资源
│       │   ├── core/   # 核心功能
│       │   ├── registry/ # 组件注册
│       │   ├── renderer/ # 组件渲染
│       │   └── utils/  # 工具函数
│       └── utils/      # 公共工具
└── styles/             # 样式文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 🎮 使用方法

### 1. 创建表单

1. 从左侧组件库拖拽组件到中间画布
2. 在右侧属性面板配置组件属性
3. 使用工具栏进行表单操作

### 2. 工具栏功能

- **清空画布**: 清除所有已添加的组件
- **编辑JSON**: 直接编辑表单的 JSON 数据
- **导出Vue文件**: 生成并下载 Vue 组件代码
- **预览代码**: 查看生成的 Vue 代码

### 3. 组件操作

- **拖拽排序**: 在画布内拖拽调整组件顺序
- **删除组件**: 选中组件后点击删除按钮
- **属性配置**: 在右侧面板修改组件属性

## 🧩 内置组件

### 基础组件
- **输入框**: 文本输入、数字输入、密码输入
- **选择器**: 下拉选择、级联选择、时间选择
- **开关组件**: 单选框、复选框、开关
- **上传组件**: 文件上传、图片上传

### 布局组件
- **行容器**: 水平排列组件
- **列容器**: 垂直排列组件
- **卡片容器**: 带边框的容器
- **分组容器**: 逻辑分组容器

### 高级组件
- **表格**: 数据表格展示
- **分页**: 分页导航
- **标签页**: 标签页切换
- **步骤条**: 步骤流程展示

## 🔧 技术特性

### 核心技术栈
- **React 18**: 使用最新的 React 特性
- **TypeScript**: 完整的类型支持
- **Ant Design**: 企业级 UI 组件库
- **Vite**: 快速的构建工具

### 拖拽系统
- **@dnd-kit**: 现代化的拖拽库
- **拖拽状态管理**: 自定义 Hook 管理拖拽状态
- **拖拽指示器**: 清晰的拖拽位置提示

### 性能优化
- **React.memo**: 组件级别的性能优化
- **useCallback**: 函数级别的性能优化
- **useMemo**: 计算结果的缓存优化

## 📁 项目结构详解

### 核心模块

#### 1. 拖拽系统 (`hooks/useDragAndDrop.ts`)
```typescript
// 通用拖拽状态管理，不包含业务逻辑
export const useDragAndDrop = <T = any>(): UseDragAndDropReturn<T> => {
  // 拖拽状态管理逻辑
}
```

#### 2. 工具函数 (`views/form/static/utils/commonUtils.ts`)
```typescript
// 公共常量和工具函数
export const DRAG_CONSTANTS = {
  ACTIVATION_DISTANCE: 8,
  COMPONENT_TYPE: 'component',
  CENTER_DROP_AREA_ID: 'center-drop-area',
}

export const utils = {
  generateId: (prefix = 'item'): string => { /* ... */ },
  validateJSONData: (data: any): { isValid: boolean; error?: string } => { /* ... */ },
  // ... 更多工具函数
}
```

#### 3. 可复用组件 (`views/form/components/`)
- **DragOverlayItem**: 拖拽过程中的视觉反馈
- **InsertIndicator**: 拖拽插入位置的指示器
- **ToolbarConfig**: 统一的工具栏配置

### 状态管理

#### 表单状态 (`store/modules/form.ts`)
```typescript
interface FormState {
  centerItems: CenterItem[]        // 画布中的组件
  selectedItemId: string | null    // 当前选中的组件
  formConfig: FormConfig          // 表单级别配置
}
```

#### 组件配置 (`store/type/form.ts`)
```typescript
interface CenterItem {
  id: string                      // 组件唯一标识
  type: string                    // 组件类型
  title: string                   // 组件标题
  description?: string            // 组件描述
  props?: Record<string, any>     // 组件属性
}
```

## 🎨 自定义扩展

### 添加新组件

1. 在 `views/form/static/core/registry/componentRegistry.ts` 中注册组件
2. 在 `views/form/static/core/renderer/componentRenderer.tsx` 中实现渲染逻辑
3. 在左侧组件库中添加组件项

### 自定义样式

- 修改 `src/styles/index.scss` 中的全局样式
- 在组件中使用 CSS Modules 或 styled-components
- 通过 CSS 变量实现主题定制

### 扩展功能

- 添加新的导出格式（如 React、Angular）
- 实现组件模板功能
- 添加表单验证规则
- 支持更多布局方式

## 🔍 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 组件使用 React.memo 优化性能
- 事件处理函数使用 useCallback 包装

### 性能优化

- 避免不必要的重渲染
- 使用 useMemo 缓存计算结果
- 合理使用 React.memo
- 优化拖拽性能

### 调试技巧

- 使用 React DevTools 调试组件状态
- 查看控制台的拖拽日志
- 使用 TypeScript 类型检查

## 🐛 常见问题

### Q: 拖拽不生效？
A: 检查是否正确配置了 @dnd-kit 的传感器和上下文

### Q: 组件渲染异常？
A: 检查组件注册是否正确，属性配置是否完整

### Q: 性能问题？
A: 检查是否正确使用了 React.memo 和 useCallback

### Q: 类型错误？
A: 确保 TypeScript 配置正确，类型定义完整

## 📚 相关文档

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Ant Design 组件库](https://ant.design/)
- [@dnd-kit 拖拽库](https://docs.dndkit.com/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
