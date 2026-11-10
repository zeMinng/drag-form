import type { CenterItem } from '@/store/type'

export const getGeneratedFieldName = (item: CenterItem): string => {
  if (item.vmodel?.trim()) return item.vmodel.trim()

  const compactId = item.id.replaceAll('-', '').slice(0, 6)
  return `${item.type}_${compactId}`
}
