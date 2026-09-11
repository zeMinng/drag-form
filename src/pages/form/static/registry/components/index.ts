/**
 * 组件配置聚合导出
 * 按分类（input / select / layout）拆分，便于维护和扩展
 */

import type { ComponentConfig } from '@/pages/form/static/types/component'
import { inputConfigs } from './input'
import { selectConfigs } from './select'
import { layoutConfigs } from './layout'

export const defaultConfigs: Record<string, ComponentConfig> = {
  ...inputConfigs,
  ...selectConfigs,
  ...layoutConfigs,
}
