import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import type { PersistOptions } from 'zustand/middleware'

/**
 * 持久化选项类型
 */
type PersistedStoreOptions<T> = Pick<PersistOptions<T>, 'onRehydrateStorage'>

/**
 * 全局工厂：创建带持久化的 Zustand Store
 * @param key localStorage 中的存储 key
 * @param initializer 定义初始状态和方法，接收 set、get、api
 * @param options 持久化选项
 */
export function createPersistedStore<T extends object>(
  key: string,
  initializer: StateCreator<T>,
  options?: PersistedStoreOptions<T>
) {
  // persist 返回的 creator 带有额外的 mutators，需要强制转换为 StateCreator<T>
  const persistedCreator = persist(
    initializer,
    {
      name: key,
      storage: createJSONStorage(() => localStorage),
      ...options,
    }
  ) as unknown as StateCreator<T>

  return create<T>(persistedCreator)
}
