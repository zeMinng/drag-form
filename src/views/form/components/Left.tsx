import { Segmented, List } from 'antd'
import { leftListSegmentedOptions, componentMappings } from '../static/mapping/leftListMapping'
import type { ComponentCategory, ComponentMeta } from '../static/mapping/leftListMapping'
import '../style/Left.scss'

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
          renderItem={(item) => (
            <List.Item className="left-list-item">
              <List.Item.Meta
                avatar={<i className={`iconfont ${item.icon}`} />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default Left
