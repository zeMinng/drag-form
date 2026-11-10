import { v4 as uuidv4 } from 'uuid'
import type { CenterItem, CenterItemDraft } from '@/store/type'

export const createCenterItem = (item: CenterItemDraft): CenterItem => {
  const { children, ...properties } = item
  return {
    ...properties,
    id: uuidv4(),
    ...(children ? { children: children.map(createCenterItem) } : {}),
  }
}

export const updateItemInTree = (
  items: CenterItem[],
  id: string,
  updates: Partial<CenterItem>,
): CenterItem[] =>
  items.map((item) => {
    if (item.id === id) return { ...item, ...updates }
    if (!item.children?.length) return item
    return { ...item, children: updateItemInTree(item.children, id, updates) }
  })

export const removeItemFromTree = (items: CenterItem[], id: string): CenterItem[] =>
  items
    .filter((item) => item.id !== id)
    .map((item) =>
      item.children?.length ? { ...item, children: removeItemFromTree(item.children, id) } : item,
    )

export const findItemInTree = (items: CenterItem[], id: string): CenterItem | null => {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children?.length) {
      const found = findItemInTree(item.children, id)
      if (found) return found
    }
  }
  return null
}
