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

  /**
   * 生成缓存键
   * @param items 组件项数组
   * @param formConfig 表单配置
   * @returns 缓存键
   */
  generateCacheKey(items: any[], formConfig: any): string {
    return JSON.stringify({
      items: items.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        vmodel: item.vmodel,
        props: item.props
      })),
      formConfig
    })
  }

  /**
   * 获取缓存值
   * @param key 缓存键
   * @returns 缓存值或undefined
   */
  get(key: string): string | undefined {
    return this.cache.get(key)
  }

  /**
   * 设置缓存值
   * @param key 缓存键
   * @param value 缓存值
   */
  set(key: string, value: string): void {
    // 检查缓存大小，如果超过限制则清理
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
    // 删除第一个缓存项（FIFO策略）
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
