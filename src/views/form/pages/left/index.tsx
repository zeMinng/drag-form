import React, { useState, useMemo, useCallback } from 'react'
import { Segmented, List } from 'antd'
import { useDraggable } from '@dnd-kit/core'
import IconFont from '@/components/Icon'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getComponentMetasByCategory } from '@/views/form/static'
import type { ComponentCategory, ComponentMeta } from '@/views/form/static/type/component'
import './index.scss'

const DraggableListItem: React.FC<{ item: ComponentMeta }> = React.memo(({ item }) => {
  const draggable = useDraggable({ 
    id: item.key, 
    data: { 
      ...item, 
      type: 'component' // 添加类型标识，用于区分组件拖拽
    } 
  })
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 防止拖拽时触发其他事件
    e.stopPropagation()
  }, [])
  
  return (
    <List.Item
      className="left-list-item"
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      onMouseDown={handleMouseDown}
    >
      <List.Item.Meta
        avatar={<IconFont type={item.icon || ''} className="left-list-icon" />}
        title={item.title}
        description={item.description}
      />
    </List.Item>
  )
})

const Left: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ComponentCategory>('input')

  const data = useMemo(() => getComponentMetasByCategory(selectedType), [selectedType])

  const leftListSegmentedOptions = useMemo(() => [
    { label: '输入型', value: 'input' },
    { label: '选择型', value: 'select' },
    { label: '布局型', value: 'layout' },
  ] satisfies { label: string; value: ComponentCategory }[], [])

  const handleTypeChange = useCallback((value: ComponentCategory) => {
    setSelectedType(value)
  }, [])

  const renderItem = useCallback((item: ComponentMeta) => (
    <DraggableListItem key={item.key} item={item} />
  ), [])

  return (
    <div className="left">
      <div className="segmented">
        <Segmented<ComponentCategory>
          block
          options={leftListSegmentedOptions}
          value={selectedType}
          onChange={handleTypeChange}
          className="left-segmented"
        />
      </div>
      <div className="left-list">
        <ErrorBoundary>
          <List
            className='ListData'
            split={false}
            dataSource={data}
            itemLayout="horizontal"
            renderItem={renderItem}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default Left
