/**
 * React / Ant Design JSX 属性序列化
 */

const SKIP_PROPS = new Set(['clearable', 'options', 'title'])

export const filterAntdProps = (props: Record<string, unknown> = {}): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (SKIP_PROPS.has(key)) continue
    if (value === undefined || value === null || value === '') continue
    result[key] = value
  }
  return result
}

const escapeString = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")

export const formatReactProp = (key: string, value: unknown): string => {
  if (typeof value === 'boolean') {
    return value ? `${key}={true}` : ''
  }
  if (typeof value === 'number') {
    return `${key}={${value}}`
  }
  if (typeof value === 'string') {
    return `${key}="${escapeString(value)}"`
  }
  if (Array.isArray(value)) {
    return `${key}={${JSON.stringify(value)}}`
  }
  if (typeof value === 'object' && value !== null) {
    if (key === 'responsive') {
      return Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([bp, v]) => `${bp}={${v}}`)
        .join(' ')
    }
    return `${key}={${JSON.stringify(value)}}`
  }
  return ''
}

export const buildReactPropsString = (props: Record<string, unknown> = {}): string => {
  return Object.entries(filterAntdProps(props))
    .map(([key, value]) => formatReactProp(key, value))
    .filter(Boolean)
    .join(' ')
}
