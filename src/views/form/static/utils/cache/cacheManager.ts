/**
 * 缓存管理工具
 * 用于管理代码生成的缓存，避免重复计算
 */

/**
 * 代码缓存管理器
 */
export class CodeCacheManager {
  private cache = new Map<string, string>()
  private maxSize: number

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  private stableStringify(value: any): string {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value)
    }
    if (Array.isArray(value)) {
      return '[' + value.map(v => this.stableStringify(v)).join(',') + ']'
    }
    const keys = Object.keys(value).sort()
    const entries = keys.map(k => `${JSON.stringify(k)}:${this.stableStringify(value[k])}`)
    return '{' + entries.join(',') + '}'
  }

  private stringHash(str: string): string {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      // hash * 33 + char
      hash = ((hash << 5) + hash) + str.charCodeAt(i)
      hash |= 0
    }
    // 转成无符号并输出为16进制，缩短长度
    return (hash >>> 0).toString(16)
  }

  /**
   * 生成缓存键
   * @param items 组件项数组
   * @param formConfig 表单配置
   * @returns 缓存键
   */
  generateCacheKey(items: any[], formConfig: any): string {
    const compactItem = (item: any): any => ({
      id: item.id,
      type: item.type,
      title: item.title,
      vmodel: item.vmodel,
      props: item.props,
      // 递归包含 children，确保布局嵌套变化会刷新缓存
      children: Array.isArray(item?.children) ? item.children.map((child: any) => compactItem(child)) : undefined,
    })

    const compact = {
      items: (items || []).map(compactItem),
      formConfig
    }
    const stable = this.stableStringify(compact)
    return this.stringHash(stable)
  }

  /**
   * 获取缓存值
   * @param key 缓存键
   * @returns 缓存值或undefined
   */
  get(key: string): string | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      // 触发LRU：刷新为最近使用
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  /**
   * 设置缓存值
   * @param key 缓存键
   * @param value 缓存值
   */
  set(key: string, value: string): void {
    if (this.cache.has(key)) {
      // 覆盖并刷新顺序
      this.cache.delete(key)
      this.cache.set(key, value)
      return
    }

    // LRU：如果超出容量，删除最早/最久未使用的键
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    this.cache.set(key, value)
  }

  /**
   * 检查缓存是否存在
   * @param key 缓存键
   * @returns 是否存在
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * 清理缓存
   */
  private cleanup(): void {
    // 删除第一个缓存项（Map的插入顺序 => LRU删除）
    const firstKey = this.cache.keys().next().value
    if (firstKey) {
      this.cache.delete(firstKey)
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存大小
   * @returns 缓存项数量
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 获取缓存统计信息
   * @returns 缓存统计信息
   */
  getStats(): { size: number; maxSize: number; usage: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: (this.cache.size / this.maxSize) * 100
    }
  }
}

// 导出默认实例
export const defaultCacheManager = new CodeCacheManager()
