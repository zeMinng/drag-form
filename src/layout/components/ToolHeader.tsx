import { QuestionCircleOutlined, GithubOutlined } from '@ant-design/icons'
import LOGO_URL from '@/assets/logo.svg'
const GITHUB_URL = 'https://github.com/zeMinng/drag-vue-form'
const APP_NAME = 'DragVueForm'

const ToolHeader: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
    }}>
      {/* 左侧Logo和App名 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={LOGO_URL} alt="logo" style={{ width: 32, height: 32, marginRight: 8 }} />
        <span style={{ fontWeight: 'bold', fontSize: 20, letterSpacing: 1 }}>
          {APP_NAME}
        </span>
      </div>
      {/* 右侧GitHub头像 */}
      <div className="flex">
        <QuestionCircleOutlined />
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <GithubOutlined style={{ fontSize: 32, textAlign: 'center', color: '#000' }} />
        </a>
      </div>
    </div>
  )
}

export default ToolHeader
