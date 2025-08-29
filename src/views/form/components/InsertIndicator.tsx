import React from 'react'

interface InsertIndicatorProps {
  position: 'top' | 'bottom'
}

/**
 * 插入指示器组件
 * 显示拖拽插入位置的视觉提示
 */
export const InsertIndicator: React.FC<InsertIndicatorProps> = React.memo(({ position }) => (
  <div className={`insert-indicator insert-${position}`}>
    <div className="insert-line"></div>
    <div className="insert-dot">拖到这里</div>
  </div>
))

InsertIndicator.displayName = 'InsertIndicator'
