import { Tabs } from 'antd'
import './index.scss'

const ComponentConfig: React.FC = () => {
  return (
    <div className="componentConfig">
      组件属性
    </div>
  )
}

const FormConfig: React.FC = () => {
  return (
    <div className="formConfig">
      表单配置
    </div>
  )
}

const Right: React.FC = () => {
  const [tabIndex, setTabIndex] = useState('component')

  const tabItems = [
    { key: 'component', label: '组件属性' },
    { key: 'form', label: '表单配置' },
  ]

  return (
    <div className="right">
      <Tabs
        activeKey={tabIndex}
        centered
        size="middle"
        items={tabItems}
        className="custom-tabs"
        onChange={setTabIndex}
      />
      <div className="right-board">
        {tabIndex === 'component' && <ComponentConfig />}
        {tabIndex === 'form' && <FormConfig />}
      </div>
    </div>
  )
}

export default Right
