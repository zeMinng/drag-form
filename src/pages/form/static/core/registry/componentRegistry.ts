import type { ComponentConfig, ComponentMeta, ComponentCategory, ComponentRegistry } from '@/pages/form/static/type/component'
import { defaultConfigs } from './components'

// 组件注册器实现
class ComponentRegistryImpl implements ComponentRegistry {
  private configs: Record<string, ComponentConfig> = { ...defaultConfigs }
  private metasCache: ComponentMeta[] | null = null
  private metasByCategoryCache = new Map<ComponentCategory, ComponentMeta[]>()

  private invalidateCaches() {
    this.metasCache = null
    this.metasByCategoryCache.clear()
  }

  register(type: string, config: ComponentConfig): void {
    this.configs[type] = config
    this.invalidateCaches()
  }

  getConfig(type: string): ComponentConfig | null {
    return this.configs[type] || null
  }

  getMeta(type: string): ComponentMeta | null {
    const config = this.getConfig(type)
    if (!config) return null

    return {
      key: type,
      title: config.label || type,
      description: config.description || '',
      icon: config.icon || 'icon-default',
      category: config.category
    }
  }

  getAllMetas(): ComponentMeta[] {
    if (this.metasCache) return this.metasCache
    this.metasCache = Object.keys(this.configs)
      .map(type => this.getMeta(type)!)
      .filter(Boolean)
    return this.metasCache
  }

  getMetasByCategory(category: ComponentCategory): ComponentMeta[] {
    if (this.metasByCategoryCache.has(category)) {
      return this.metasByCategoryCache.get(category) as ComponentMeta[]
    }
    const result = this.getAllMetas().filter(meta => meta.category === category)
    this.metasByCategoryCache.set(category, result)
    return result
  }

  updateConfig(type: string, updates: Partial<ComponentConfig>): void {
    if (this.configs[type]) {
      this.configs[type] = { ...this.configs[type], ...updates }
      this.invalidateCaches()
    }
  }

  remove(type: string): void {
    if (this.configs[type] && type !== 'input') {
      delete this.configs[type]
      this.invalidateCaches()
    }
  }

  reset(): void {
    this.configs = { ...defaultConfigs }
    this.invalidateCaches()
  }
}

// 创建全局组件注册器实例
export const componentRegistry = new ComponentRegistryImpl()

// 导出便捷方法
export const registerComponent = (type: string, config: ComponentConfig) => {
  componentRegistry.register(type, config)
}

export const getComponentConfig = (type: string) => {
  return componentRegistry.getConfig(type)
}

export const getComponentMeta = (type: string) => {
  return componentRegistry.getMeta(type)
}

export const getAllComponentMetas = () => {
  return componentRegistry.getAllMetas()
}

export const getComponentMetasByCategory = (category: ComponentCategory) => {
  return componentRegistry.getMetasByCategory(category)
} 