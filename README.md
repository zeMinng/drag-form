<div align="center">

# 🧩 drag-form

可视化拖拽搭建表单，一键导出 Vue 3 / React 生产级源码 🧩✨ 

[![React](https://img.shields.io/badge/React-19-6366f1?style=flat-square&logo=react&logoColor=white)](https://react.dev) 
[![Vue](https://img.shields.io/badge/Export-Vue_3_+_Element_Plus-6366f1?style=flat-square&logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-6366f1?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![GitHub License](https://img.shields.io/github/license/zeMinng/drag-form?style=flat-square&color=6366f1)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/zeMinng/drag-form?style=flat-square&color=6366f1)](https://github.com/zeMinng/drag-form/stargazers)
[![Demo](https://img.shields.io/badge/Demo-Online-6366f1?style=flat-square&logo=netlify&logoColor=white)](https://drag-form-view.netlify.app/)

<p align="center">
  🌐 <a href="./README.md">简体中文</a> | <b>English</b>
</p>

</div>

## ✨ 为什么选择 drag-form？

`drag-form` 是一个纯前端的可视化表单搭建器：左边拖组件、中间编排、右边配属性，最后吐出来的不是一份私有 JSON 配置，而是能直接提交进项目的 .vue 单文件组件或 React + Ant Design 页面源码。没有云端、没有账号、没有私有格式——搭建完就走，代码归你。

> [!NOTE]  
> 🚧 **持续迭代中**：v0.0.1 已完整跑通「拖拽搭建 → 属性/校验配置 → 实时预览 → 代码导出」链路。 🔗 在线体验：https://drag-form-view.netlify.app


## ✨ 特性亮点

| 模块 | 核心能力 |
| :--- | :--- |
| 🎯 **三栏搭建工作台** | 左侧组件面板 → 中间画布 → 右侧属性面板，拖入即用，画布实时渲染真实 Ant Design 组件而非占位块 |
| 🧱 **布局嵌套编排** | `row` / `col` / `card` 支持层层嵌套，画布与代码生成共用同一棵组件树，结构不会走形 |
| 🧠 **属性 & 校验双编辑器** | `PropEditor` 改占位符、默认值、尺寸；`ValidationEditor` 配必填、类型、长度、正则规则，校验规则随代码一起导出 |
| 🔀 **双轨代码生成** | 同一份表单结构，可导出 **Vue 3 + TS + Element Plus**（Composition API）与 **React + TSX + Ant Design** 两套源码 |
| 🧩 **注册器驱动扩展** | `registry`（注册）+ `renderer`（运行时渲染）+ `generator`（构建时生成）三层解耦，新增组件只写一份配置，不碰主逻辑 |
| ⌨️ **编辑器级手感** | dnd-kit 拖拽排序、选中高亮、`Ctrl/⌘ + C / V` 复制粘贴、`Delete` 删除、暗色 / 亮色主题一键切换 |

## 🧭 工作原理

registry 是唯一数据源：画布负责“看得见”，generator 负责“拿得走”，两者互不干扰。

```
registry（组件配置：meta / props / 校验规则）
   ├── renderer  ──► 画布中实时渲染（Ant Design 真实组件）
   └── generator ──► shared ─┬─► vue  ──► .vue（Element Plus）
                             └─► react ─► .tsx（Ant Design）
```

## ⚡ 快速开始

环境要求：`Node.js ≥ 22.18`，包管理器推荐 `pnpm`。

```bash
pnpm install
pnpm dev
```

> [!TIP]
💡 启动后打开终端提示的地址，从左侧拖一个 `input` 进画布，就能看到「渲染 → 配置 → 导出」整条链路跑通，不需要任何后端。

### 常用脚本

| 命令 | 作用 |
| :--- | :--- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | `tsc -b` 类型检查 + Vite 打包 |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm lint` | oxlint 静态检查 |
| `pnpm format` / `pnpm format:check` | oxfmt 格式化 / 格式校验 |

## 🛠 使用说明

1. 左侧面板挑选组件（输入型 / 选择型 / 布局型），拖入中间画布
2. 画布上选中组件后拖动排序、拖进 `row` / `col` / `card` 完成嵌套；`Delete` 删除，`Ctrl/⌘ + C / V` 复制粘贴
3. 右侧面板编辑属性与校验规则，画布实时同步效果
4. 顶部工具栏预览并导出，输入文件名即下载 `.vue`（Element Plus）或 `.tsx`（Ant Design）

> [!TIP]
💡 输入框内输入时快捷键会自动让行，不会误删组件。

## 🧩 二次开发：注册一个新组件

```typescript
import { registerComponent } from '@/pages/form/static'
import { Input } from 'antd'

registerComponent('custom-input', {
  component: Input,
  label: '自定义输入框',
  category: 'input',
  props: { placeholder: '自定义输入框' },
  propsConfig: {
    placeholder: { type: 'string', label: '占位符', defaultValue: '自定义输入框' },
  },
})
```

只需在 `registry/components/` 对应分类里补一份配置，`renderer` 与 `generator` 会同步生效——这是“高扩展性”唯一需要的成本。

## 🗂 项目结构（核心）

```
src/
├─ pages/form/pages/            # 搭建器三栏
│  ├─ left/                     # 组件面板（按分类展示可拖拽组件）
│  ├─ center/                   # 画布（排序、嵌套、选中、删除）
│  ├─ right/                    # 属性编辑 PropEditor + 校验 ValidationEditor
│  └─ downloadOutVue/           # 导出面板（文件名 + 下载）
├─ pages/form/static/           # 核心模块，统一出口 index.ts
│  ├─ types/                    # ComponentMeta / PropConfig / ValidationRule
│  ├─ registry/                 # 组件注册器 + 分类配置（input / select / layout）
│  ├─ renderer/                 # 画布运行时渲染（Antd 真实组件）
│  └─ generator/                # 代码生成：shared / vue / react 三轨
├─ store/modules/form.ts        # Zustand 表单状态（组件树、选中态、增删改）
├─ hooks/                       # useKeyboardShortcuts / useTheme
└─ components/layouts/          # 页面骨架与顶部工具栏
```

更细的模块拆分与 API 说明见 [`ARCHITECTURE.md`](./ARCHITECTURE.md) 与 [`src/pages/form/static/README.md`](./src/pages/form/static/README.md)。

## 🧱 技术栈

| 层 | 选型 |
| :--- | :--- |
| 运行端 | React 19 · TypeScript · Vite 8 · Ant Design 6 |
| 拖拽与状态 | dnd-kit（core / sortable / modifiers）· Zustand 5 |
| 导出目标 | Vue 3 + TypeScript + Element Plus · React + TSX + Ant Design |
| 工程化 | oxlint · oxfmt · Sass · bumpp（版本发布） |

## 贡献

想法与 PR 都欢迎——不妨先<a href="https://github.com/zeMinng/drag-form/issues">提个 issue</a>聊聊。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '添加一些 AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request
## 
<div align="center">
<p>
🧩 <b>drag-form</b> · 导出 <b>Vue 3 / React</b> 源码 · Crafted with ❤️ by <a href="https://github.com/zeMinng">zeMinng</a><br />
Released under the <a href="./LICENSE">MIT License</a> © 2025–present
</p>
</div>
