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
  lineHeight: '60px',
  paddingInline: 16,
  backgroundColor: '#fff',
  borderBottom: '1px solid #e9ecf0',
}
const contentStyle: React.CSSProperties = {
  height: 'calc(100vh - 60px)',
  backgroundColor: '#fff',
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
