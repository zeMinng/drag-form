# drag-vue-form

可视化表单搭建器（拖拽编排）+ Vue 代码导出工具。  
运行端基于 React + Vite，导出目标为 Vue 3 + TypeScript + Element Plus 单文件组件（`.vue`）。

## 功能特性

- 左侧组件面板拖拽到画布，快速搭建表单页面
- 支持组件排序、选中和属性配置
- 支持布局类组件（如 `row/col`）的嵌套编排
- 实时维护表单结构状态，支持代码生成
- 一键导出 Vue 3 + TS + Element Plus 代码文件

## 技术栈

- React 19
- TypeScript
- Vite
- Ant Design
- dnd-kit
- Zustand

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 启动开发环境

```bash
npm run dev
```

### 3) 打包构建

```bash
npm run build
```

### 4) 本地预览

```bash
npm run preview
```

### 5) 代码检查

```bash
npm run lint
```

## 项目结构（核心）

```text
src/
├─ pages/form/pages/           # 搭建器页面（左中右面板）
├─ pages/form/static/          # 重构后的代码生成器/渲染器/注册器核心模块
│  ├─ types/                   # 核心类型定义
│  ├─ registry/                # 组件注册器与配置 (分类维护)
│  ├─ renderer/                # 组件运行时渲染器
│  └─ generator/               # 代码生成器 (Vue ElementPlus / React Antd 双轨)
├─ store/modules/form.ts       # 表单状态管理（Zustand）
├─ router/                     # 路由配置
└─ layout/                     # 页面布局与头部工具栏
```

## 使用说明

1. 在左侧选择组件并拖拽到中间画布
2. 在右侧面板调整组件属性、校验等配置
3. 点击导出，输入文件名后生成 `.vue` 文件

## 注意事项

- 当前仓库名包含 `vue`，但编辑器本身为 React 项目
- `vue` 体现在导出结果：生成 Vue 3 + TypeScript + Element Plus 代码
