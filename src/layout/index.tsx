import { Outlet } from 'react-router-dom'
import ToolHeader from './components/ToolHeader/ToolHeader'
import { Flex, Layout, Modal, Typography  } from 'antd'
const { Header, Content } = Layout
const { Paragraph } = Typography

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
            title="公告"
            centered
            open={isModalOpen}
            onOk={handleClose}
            onCancel={handleClose}
            footer={null}
          >
            <Paragraph>
              🎉 恭喜，现已支持导出 Vue3 + Element-Plus + TS 代码！
            </Paragraph>
          </Modal>
        </Content>
      </Layout>
    </Flex>
  </>
}

export default MyLayout
