import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Popover, Flex, Button, Tooltip } from 'antd'
import { QuestionCircleOutlined, GithubOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import MenuWrap from './Menu'
import LOGO_URL from '@/assets/logo_w60.svg'
const GITHUB_URL = 'https://github.com/zeMinng/drag-vue-form'
const APP_NAME = 'DragVueForm'

const ToolHeader: React.FC = () => {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // TODO: 这里后续会添加实际的暗黑模式切换逻辑
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        userSelect: 'none',
      }}
    >
      {/* 左侧 Logo + 名称 */}
      <div
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => navigate('/', { replace: true })}
      >
        <img
          src={LOGO_URL}
          alt='logo'
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        <span style={{ 
          fontSize: 20, 
          fontWeight: '700', 
          color: '#1a1a1a',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {APP_NAME}
        </span>
      </div>

      {/* 右侧功能区 */}
      <Flex gap='small' align='center'>
        <MenuWrap />

        {/* 暗黑模式切换按钮 */}
        <Tooltip title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}>
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleDarkMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666',
              transition: 'all 0.2s ease',
              fontSize: 16
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isDarkMode ? '#ffd700' : '#ff6b35'
              e.currentTarget.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#fff5f0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          />
        </Tooltip>

        {/* 帮助按钮 */}
        <Tooltip title="帮助信息">
          <Popover
            trigger='click'
            placement='bottomRight'
            content={
              <div style={{ maxWidth: 240, padding: '4px 0' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>表单可视化编辑器</p>
                <p
                  style={{
                    margin: '6px 0 0',
                    color: '#666',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  生成 Vue 3.x + Element Plus 代码，支持拖拽、配置、预览等功能。
                </p>
              </div>
            }
          >
            <Button
              type="text"
              icon={<QuestionCircleOutlined />}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                color: '#666',
                backgroundColor: 'transparent',
                border: 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1890ff'
                e.currentTarget.style.backgroundColor = '#f0f8ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            />
          </Popover>
        </Tooltip>

        {/* GitHub 按钮 */}
        <Tooltip title="查看 GitHub 仓库">
          <Button
            type="text"
            icon={<GithubOutlined />}
            onClick={() => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              color: '#666',
              backgroundColor: 'transparent',
              border: 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000'
              e.currentTarget.style.backgroundColor = '#f0f0f0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          />
        </Tooltip>
      </Flex>
    </div>
  )
}

export default ToolHeader
