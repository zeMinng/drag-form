import { Segmented, List } from 'antd'
import { useDraggable } from '@dnd-kit/core'
import { leftListSegmentedOptions, componentMappings } from '../static/mapping/leftListMapping'
import type { ComponentCategory, ComponentMeta } from '../static/mapping/leftListMapping'
import '../style/Left.scss'

const DraggableListItem: React.FC<{ item: ComponentMeta }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.key,
    data: item, // 拖拽时携带的数据
  })
  
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      <List.Item className="left-list-item">
        <List.Item.Meta
          avatar={<i className={`iconfont ${item.icon}`} />}
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
