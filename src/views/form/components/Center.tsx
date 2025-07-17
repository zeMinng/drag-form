import { Modal } from 'antd'
import { DeleteOutlined, EyeOutlined, PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { useFormStore } from '@/store/modules/form'

import '../style/Center.scss'

const clearTheCanvas = () => {
  Modal.confirm({
    title: '提示',
    content: '确定要清空画布吗？',
    centered: true,
    onOk: () => {
      useFormStore.setState({
        centerItems: [],
      })
    },
  })
}

const save = () => {
  Modal.confirm({
    title: '提示',
    content: '草泥马',
    centered: true,
  })
}

const CenterTop: React.FC = () => {

  return (
    <div className="centerTop">
      <Flex gap="small" wrap>
        <Button icon={<DeleteOutlined />} color="danger" variant="filled" onClick={() => clearTheCanvas()}>
          清空画布
        </Button>
        <Button icon={<EyeOutlined />} color="cyan" variant="filled">
          查看JSON
        </Button>
        <Button icon={<DownloadOutlined />} color="primary" variant="filled">
          导出Vue文件
        </Button>
        <Button icon={<PlayCircleOutlined />} color="primary" variant="filled" onClick={() => save()}>
          运行
        </Button>
      </Flex>
    </div>
  )
}

const Center: React.FC = () => {
  const { centerItems } = useFormStore()
  const { setNodeRef, isOver } = useDroppable({ id: 'center-drop-area' })

  return (
    <div className='centerWrap'>
      <CenterTop />
      <div
        ref={setNodeRef}
        className="center-container"
        style={{
          border: isOver ? '2px dashed #1890ff' : '2px dashed #eee',
        }}
      >
        {centerItems.length === 0 ? (
          <div className="center-placeholder">请从左侧拖拽组件到这里</div>
        ) : (
          centerItems.map((item) => (
            <div key={item.id} className="center-item">
              <i className={`iconfont ${item.icon}`} /> {item.title}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Center