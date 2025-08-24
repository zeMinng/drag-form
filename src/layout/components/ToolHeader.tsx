import { useNavigate } from "react-router-dom"
import { Popover } from 'antd'
import { QuestionCircleOutlined, GithubOutlined } from '@ant-design/icons'
import MenuWrap from './Menu'
import LOGO_URL from '@/assets/logo.svg'
const GITHUB_URL = 'https://github.com/zeMinng/drag-vue-form'
const APP_NAME = 'DragVueForm'

const ToolHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      userSelect: 'none',
    }}>
      {/* 左侧Logo和App名 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={LOGO_URL} alt="logo" style={{ width: 32, height: 32, marginRight: 8, cursor: 'pointer' }} onClick={() => navigate('/', { replace: true })} />
        <span style={{ fontWeight: 'bold', fontSize: 20, letterSpacing: 1 }}>
          {APP_NAME}
        </span>
      </div>
      {/* 右侧GitHub头像 */}
      <div className="flex">
        <Flex gap="middle" align="center">
          <MenuWrap />
          <Popover
            trigger="click"
            content="表单可视化编辑器：生成 Vue 3.x + Element Plus 代码，支持拖拽、配置、预览等功能"
          >
            <QuestionCircleOutlined style={{ fontSize: 16, }} />
          </Popover>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GithubOutlined style={{ fontSize: 32, textAlign: 'center', color: '#000' }} />
          </a>
        </Flex>
      </div>
    </div>
  )
}

export default ToolHeader
