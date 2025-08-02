import { Segmented, List } from 'antd'
import { useDraggable } from '@dnd-kit/core'
import IconFont from '@/components/Icon'
import { leftListSegmentedOptions, componentMappings } from '../../static/mapping/leftListMapping'
import type { ComponentCategory, ComponentMeta } from '../../static/mapping/leftListMapping'
import './index.scss'

const DraggableListItem: React.FC<{ item: ComponentMeta }> = ({ item }) => {
  const draggable = useDraggable({ 
    id: item.key, 
    data: { 
      ...item, 
      type: 'component' // 添加类型标识，用于区分组件拖拽
    } 
  })
  return (
    <List.Item
      className="left-list-item"
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
    >
      <List.Item.Meta
        avatar={<IconFont type={item.icon || ''} className="left-list-icon" />}
        title={item.title}
        description={item.description}
      />
    </List.Item>
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
