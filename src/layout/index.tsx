import { Outlet } from 'react-router-dom'
import ToolHeader from './components/ToolHeader'
import { Flex, Layout, Modal } from 'antd'
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
  // 判断是否生产环境
  const isProd = import.meta.env.PROD
  const [isModalOpen, setIsModalOpen] = useState(isProd)
  const handleClose = () => {
    setIsModalOpen(false)
  }

  return <>
    <Flex gap="middle" wrap>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <ToolHeader />
        </Header>
        <Content style={contentStyle}>
          <Outlet />

          <Modal
            title="重大通知"
            centered
            open={isModalOpen}
            onOk={handleClose}
            onCancel={handleClose}
            okText="确定"
            cancelText="关闭"
          >
            <p></p>
            <p>🎉 恭喜，现已支持简单导出 Vue 3 + element-plus + ts 代码！</p>
            <p>但是还有已知bug，请等待...</p>
          </Modal>
        </Content>
      </Layout>
    </Flex>
  </>
}

export default MyLayout
