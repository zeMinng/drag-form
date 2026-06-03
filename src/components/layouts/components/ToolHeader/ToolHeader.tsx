import { useNavigate } from 'react-router-dom'
import { Popover, Flex, Button, Tooltip } from 'antd'
import { QuestionCircleOutlined, GithubOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useTheme } from '@/hooks/useTheme'
import MenuWrap from '../Menu/Menu'
import LOGO_URL from '@/assets/logo_w60.svg'
import './ToolHeader.scss'

const GITHUB_URL = 'https://github.com/zeMinng/drag-vue-form'
const APP_NAME = 'DragVueForm'

const ToolHeader: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="tool-header">
      <div className="logo-section" onClick={() => navigate('/', { replace: true })}>
        <img
          src={LOGO_URL}
          alt='logo'
          className="logo-image"
        />
        <span className="app-name">{APP_NAME}</span>
      </div>

      {/* 右侧功能区 */}
      <Flex gap="small" align="center" className="action-buttons">
        <MenuWrap />

        <div className="time" style={{fontSize: 14, color: 'var(--text-secondary)'}}>最后更新时间：{__BUILD_TIME__}</div>

        {/* 主题切换按钮 */}
        <Tooltip title={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            className={`theme-toggle-btn ${isDark ? 'dark-mode' : ''}`}
          />
        </Tooltip>

        {/* 帮助按钮 */}
        <Tooltip title="帮助信息">
          <Popover
            trigger='click'
            placement='bottomRight'
            content={
              <div className="help-popover">
                <p className="help-title">表单可视化编辑器</p>
                <p className="help-description">
                  支持拖拽搭建，预览/导出 Vue3 + Element Plus 或 React + Ant Design 代码。
                </p>
              </div>
            }
          >
            <Button
              type="text"
              icon={<QuestionCircleOutlined />}
              className="help-btn"
            />
          </Popover>
        </Tooltip>

        {/* GitHub 按钮 */}
        <Tooltip title="查看 GitHub 仓库">
          <Button
            type="text"
            icon={<GithubOutlined />}
            onClick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}
            className="github-btn"
          />
        </Tooltip>
      </Flex>
    </div>
  )
}

export default ToolHeader
