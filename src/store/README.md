# Store 模块结构

## 目录结构

```
src/store/
├── type/                # 类型定义文件夹
│   ├── form.ts         # 表单相关类型
│   └── index.ts        # 类型统一导出
├── constants/           # 常量定义文件夹
│   ├── form.ts         # 表单相关常量
│   └── index.ts        # 常量统一导出
├── modules/             # Store 实现模块
│   └── form.ts         # 表单状态管理
└── index.ts             # Store 工厂函数
```

## 模块说明

### 类型定义 (type/)
- **form.ts**: 表单相关的所有类型定义
  - `CenterItem`: 表单组件项接口
  - `FormConfig`: 表单配置接口
  - `FormState`: 表单状态接口
  - `FormActions`: 表单操作方法接口
  - `FormStore`: 完整的表单store类型

### 常量定义 (constants/)
- **form.ts**: 表单相关常量
  - `defaultFormConfig`: 默认表单配置

### Store 实现 (modules/)
- **form.ts**: 表单状态管理实现
  - 使用 Zustand 进行状态管理
  - 支持持久化存储
  - 所有表单操作方法

## 使用方式

### 导入类型
```typescript
import type { CenterItem, FormConfig } from '@/store/type'
```

### 导入常量
```typescript
import { defaultFormConfig } from '@/store/constants'
```

### 使用 Store
```typescript
import { useFormStore } from '@/store/modules/form'

const { centerItems, addCenterItem, updateFormConfig } = useFormStore()
```

## 设计原则

1. **关注点分离**: 类型、常量、实现分别管理
2. **类型安全**: 完整的 TypeScript 支持
3. **可复用性**: 类型和常量可以在多个模块间共享
4. **可维护性**: 清晰的代码结构和职责划分
5. **向后兼容**: 保持原有 API 不变

## 扩展说明

### 添加新的类型
1. 在 `type/` 文件夹下创建新的类型文件（如 `user.ts`、`settings.ts` 等）
2. 在 `type/index.ts` 中导出新类型

### 添加新的常量
1. 在 `constants/` 文件夹下创建新的常量文件
2. 在 `constants/index.ts` 中导出新常量

### 添加新的 Store
1. 在 `modules/` 文件夹下创建新的 store 文件
2. 使用 `createPersistedStore` 工厂函数
3. 导入相应的类型和常量
