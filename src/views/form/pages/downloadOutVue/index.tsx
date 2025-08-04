import Mustache from 'mustache'
import { Modal, Radio, message } from 'antd'
import template from '@/templates/FormExport.vue.mustache?raw'
import { useFormStore } from '@/store/modules/form'

interface Props {
  open: boolean
  onClose: () => void
}

type FieldType = {
  buildType?: number
  filename?: string
}


const DownloadOutVue: React.FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm<FieldType>() // 1. 获取表单实例
  const { centerItems, } = useFormStore()

  const onOk = async () => {
    const values = await form.validateFields() // 2. 获取并验证表单值
    const { filename } = values

    const vueContent = Mustache.render(template, {
      items: centerItems.map(item => ({
        type: item.type,
        label: item.title,
        attrs: {
          placeholder: item.description,
          ...item?.props
        }
      })),
      // Mustache 默认会 HTML 转义，我们希望注入 JSON 原始文本
      json: (text: any) => JSON.stringify(text, null, 2)
    })

    const blob = new Blob([vueContent], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename!.endsWith('.vue') ? filename! : filename + '.vue'
    link.click()

    window.URL.revokeObjectURL(url)
    message.success('导出成功！')
    onClose()
  }

  return (
    <>
      <Modal
        title="导出 Vue 文件"
        centered
        open={open}
        onCancel={onClose}
        onOk={onOk}
        okText="导出"
        cancelText="取消"
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ buildType: 1, }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="生成类型" 
            name="buildType"
            rules={[{ required: true, message: '请选择生成类型' }]}
          >
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              disabled
              options={[
                { value: 1, label: '页面' },
                { value: 2, label: '弹窗' },
              ]}
            >
            </Radio.Group>
          </Form.Item>
          <Form.Item<FieldType>
            label="文件名"
            name="filename"
            rules={[{ required: true, message: '请输入文件名' }]}
          >
            <Input
              placeholder="请输入文件名，如 MyComponent.vue"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default DownloadOutVue
