import LOGO_URL from '@/assets/logo.svg'
const GITHUB_URL = 'https://github.com/zeMinng/drag-vue-form'
const AVATAR_URL = 'https://avatars.githubusercontent.com/u/9919?s=200&v=4'
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
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
        <img
          src={AVATAR_URL}
          alt="GitHub"
          style={{ width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', border: '1px solid #eee' }}
        />
      </a>
    </div>
  )
}

export default ToolHeader
