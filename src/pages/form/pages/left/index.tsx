import React, { useState, useMemo } from 'react'
import { Listy, Segmented } from 'antd'
import { useDraggable } from '@dnd-kit/core'
import IconFont from '@/components/business/Icon'
import { getComponentMetasByCategory } from '@/pages/form/static'
import type { ComponentCategory, ComponentMeta } from '@/pages/form/static/types/component'
import './index.scss'

const DraggableListItem: React.FC<{ item: ComponentMeta }> = React.memo(({ item }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.key,
    data: {
      ...item,
      type: 'component', // 添加类型标识，用于区分组件拖拽
    },
  })
  return (
    <div className="left-list-item" ref={setNodeRef} {...attributes} {...listeners}>
      <span className="left-list-icon-wrap">
        <IconFont type={item.icon || ''} className="left-list-icon" />
      </span>
      <div className="left-list-item-content">
        <div className="left-list-item-title">{item.title}</div>
        <div className="left-list-item-description">{item.description}</div>
      </div>
    </div>
  )
})

const renderDraggableListItem = (item: ComponentMeta) => <DraggableListItem item={item} />

const Left: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ComponentCategory>('input')

  const data = useMemo(() => getComponentMetasByCategory(selectedType), [selectedType])

  const leftListSegmentedOptions = useMemo(
    () =>
      [
        { label: '输入型', value: 'input' },
        { label: '选择型', value: 'select' },
        { label: '布局型', value: 'layout' },
      ] satisfies { label: string; value: ComponentCategory }[],
    [],
  )

  return (
    <div className="left">
      <div className="segmented">
        <Segmented<ComponentCategory>
          block
          options={leftListSegmentedOptions}
          value={selectedType}
          onChange={setSelectedType}
          className="left-segmented"
        />
      </div>
      <div className="left-list">
        <Listy<ComponentMeta>
          className="left-list-data"
          classNames={{ item: 'left-list-row' }}
          items={data}
          rowKey="key"
          virtual={false}
          itemRender={renderDraggableListItem}
        />
      </div>
    </div>
  )
}

export default Left
