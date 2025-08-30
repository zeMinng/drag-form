import React from 'react'
import IconFont from '@/components/Icon'
import { STYLES } from '../static/utils/commonUtils'

interface DragOverlayItemProps {
  item: {
    title: string
    description: string
    icon?: string
  }
}

/**
 * 拖拽覆盖层组件
 * 在拖拽过程中显示拖拽项的预览
 */
export const DragOverlayItem: React.FC<DragOverlayItemProps> = React.memo(({ item }) => (
  <div className="left-list-item" style={STYLES.DRAG_OVERLAY}>
    <span className="left-list-icon" style={STYLES.ICON}>
      {item.icon && <IconFont type={item.icon} />}
    </span>
    <div style={{ marginLeft: 8 }}>
      <div style={STYLES.TITLE}>{item.title}</div>
      <div style={STYLES.DESCRIPTION}>{item.description}</div>
    </div>
  </div>
))

DragOverlayItem.displayName = 'DragOverlayItem'
