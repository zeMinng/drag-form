/*
 * @Author: zeMing 2439340964@qq.com
 * @Date: 2025-08-06 10:45:19
 * @LastEditors: zeMing 2439340964@qq.com
 * @LastEditTime: 2025-08-06 10:46:54
 * @FilePath: \drag-vue-form\src\utils\componentRenderer.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
// import { getComponentConfig } from './componentRegistry'
// import type { FormComponent } from '@/types/component'

// 组件包装器
export const ComponentWrapper: React.FC<{ 
  title: string
  children: React.ReactNode 
}> = ({ title, children }) => (
  <div className="componentItem">
    <div className="itemTitle">{title}</div>
    <div className="itemContent">{children}</div>
  </div>
) 