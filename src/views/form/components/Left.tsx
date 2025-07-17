import { Segmented, List } from 'antd'
import { useDraggable } from '@dnd-kit/core'
import IconFont from '@/components/Icon'
import { leftListSegmentedOptions, componentMappings } from '../static/mapping/leftListMapping'
import type { ComponentCategory, ComponentMeta } from '../static/mapping/leftListMapping'
import '../style/Left.scss'

export const DraggableListItem: React.FC<{ item: ComponentMeta; isDragging?: boolean }> = ({ item, isDragging }) => {
  // 只有在 Left 里用 useDraggable，DragOverlay 里不用
  const draggable = useDraggable({ id: item.key, data: item })
  
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      style={{ 
        opacity: isDragging ? 0.8: 1,
        cursor: 'grab',
        background: isDragging ? '#fff' : '#fff',
        border: isDragging ? '1px solid #1890ff' : '',
        boxShadow: isDragging ? '0 2px 8px rgba(24,144,255,0.2)' : 'none',
        padding: isDragging ? '8px' : '0',
        marginBottom: isDragging ? '8px' : '0',
        borderRadius: isDragging ? '4px' : '0',
        listStyle: isDragging ? 'none' : 'none',
      }}
    >
      <List.Item className="left-list-item">
        <List.Item.Meta
          avatar={<IconFont type={item.icon || ''} className="left-list-icon" />}
          title={item.title}
          description={item.description}
        />
      </List.Item>
    </div>
  )
}

const Left: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ComponentCategory>('input')

  const data: ComponentMeta[] = componentMappings[selectedType] || []

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
        <List
          className='ListData'
          split={false}
          dataSource={data}
          itemLayout="horizontal"
          renderItem={(item) => <DraggableListItem item={item} />}
        />
      </div>
    </div>
  )
}

export default Left
