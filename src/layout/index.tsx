import { Outlet } from 'react-router-dom'
import ToolHeader from './components/ToolHeader'
import { Flex, Layout } from 'antd'
const { Header, Content } = Layout

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
}
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 60,
  paddingInline: 32,
  // lineHeight: '64px',
  backgroundColor: 'transparent',
  boxShadow: '0 2px 8px rgba(0, 21, 41, 0.35)',
}
const contentStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 60px)',
  lineHeight: '120px',
  color: '#fff',
}

const MyLayout: React.FC = () => {
  return <>
    <Flex gap="middle" wrap>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <ToolHeader />
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Flex>
  </>
}

export default MyLayout
